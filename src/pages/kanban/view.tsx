import { useState } from "react";
import {
  cardDeleteClicked,
  cardEditClicked,
  cardMoved,
  PageGate,
  $cardsPendingMap,
} from "./model";

import { useGate, useUnit, useStoreMap } from "effector-react";
import { containerStyles } from "../../container";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Group, Loader } from "@mantine/core";
import { IconCheck, IconPencil, IconTrash, IconX } from "@tabler/icons-react";
import cn from "clsx";

import { Button } from "../../button";
import { customScrollStyles } from "../../custom-scroll";
import { Textarea } from "../../textarea";
import styles from "./styles.module.css";
import { $board, cardCreateClicked, type KanbanCard } from "./model";

export function KanbanBoard() {
  const [board, onCardMove] = useUnit([$board, cardMoved]);

  useGate(PageGate);

  const handleDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (!destination) {
      // Dropped outside droppable
      return;
    }

    const cardId = draggableId;
    const fromListId = source.droppableId;
    const toListId = destination.droppableId;
    const fromIndex = source.index;
    const toIndex = destination.index;

    onCardMove({ fromListId, toListId, fromIndex, toIndex, cardId });
  };

  return (
    <section className={cn(containerStyles, styles.section)}>
      <header className={styles.headerSection}>
        <h1 className={styles.title}>Sprint #1</h1>
      </header>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={cn(styles.board, customScrollStyles)}>
          {board.map((list) => (
            <KanbanColumn
              key={list.id}
              id={list.id}
              title={list.title}
              cards={list.cards}
            >
              <KanbanCreateCard listId={list.id} />
            </KanbanColumn>
          ))}
        </div>
      </DragDropContext>
    </section>
  );
}

function KanbanColumn({
  title,
  id,
  cards,
  children,
}: {
  title: string;
  id: string;
  cards: KanbanCard[];
  children?: React.ReactNode;
}) {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          className={styles.column}
          {...provided.droppableProps}
        >
          <p className={styles.columnTitle}>{title}</p>
          <div className={styles.list}>
            {cards.map(({ id: cardId, title: cardTitle }, index) => (
              <KanbanCard
                key={cardId}
                id={cardId}
                index={index}
                title={cardTitle}
                listId={id}
              />
            ))}
            {provided.placeholder}
            {children}
          </div>
        </div>
      )}
    </Droppable>
  );
}

interface KanbanEditCardProps {
  cardId: string;
  listId: string;
  title: string;
  onFinished: () => void;
}

function KanbanEditCard({
  cardId,
  listId,
  title,
  onFinished,
}: KanbanEditCardProps) {
  const [onCardEdit] = useUnit([cardEditClicked]);
  const [editTitle, setEditTitle] = useState(title);

  function onEditFinished() {
    onCardEdit({ listId, cardId, card: { title: editTitle } });
    onFinished();
  }

  return (
    <div className={styles.kanbanCard}>
      <Textarea value={editTitle} onValue={setEditTitle} />
      <Group gap="xs" mt="sm">
        <ActionIcon onClick={onEditFinished}>
          <IconCheck size={14} />
        </ActionIcon>
        <ActionIcon onClick={onFinished}>
          <IconX size={14} />
        </ActionIcon>
      </Group>
    </div>
  );
}

function KanbanCard({
  id,
  index,
  title,
  listId,
}: {
  id: string;
  index: number;
  title: string;
  listId: string;
}) {
  const [editMode, editHandlers] = useDisclosure(false);

  const [onCardDelete] = useUnit([cardDeleteClicked]);
  const disabled = useStoreMap({
    store: $cardsPendingMap,
    keys: [id],
    fn: (pendingMap, [cardId]) => pendingMap[cardId] ?? false,
  });

  const onDelete = () => {
    onCardDelete({ listId, cardId: id });
  };

  if (editMode) {
    return (
      <KanbanEditCard
        cardId={id}
        listId={listId}
        title={title}
        onFinished={editHandlers.close}
      />
    );
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            styles.kanbanCard,
            disabled && styles.disabled,
            snapshot.isDragging ? styles.dragging : null
          )}
        >
          <p className={styles.kanbanCardText}>{title}</p>
          <Group hidden={!disabled}>
            <Loader size="sm" />
          </Group>
          <Group hidden={disabled}>
            <ActionIcon onClick={editHandlers.open}>
              <IconPencil size={14} />
            </ActionIcon>
            <ActionIcon onClick={onDelete}>
              <IconTrash size={14} />
            </ActionIcon>
          </Group>
        </div>
      )}
    </Draggable>
  );
}

function KanbanCreateCard({ listId }: { listId: string }) {
  const [onCreateCard] = useUnit([cardCreateClicked]);
  const [title, setTitle] = useState("");

  const onReset = () => {
    setTitle("");
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onCreateCard({ listId, card: { title } });
    onReset();
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Textarea
        value={title}
        onValue={setTitle}
        placeholder="Start making new card here"
      />
      <Button type="submit">Add card</Button>
    </form>
  );
}
