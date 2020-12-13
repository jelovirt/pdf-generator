import React, { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { DragSourceMonitor } from 'react-dnd/lib/interfaces/monitors';

export enum ItemTypes {
  COPYRIGHT = 'copyright',
  TITLE = 'title',
  CHAPTER = 'chapter',
  FOLIO = 'folio',
  FOLIO_WITH_TOTAL = 'folio-with-total',
}

export const locale = {
  Tag: {
    label: {
      [ItemTypes.COPYRIGHT]: 'copyright',
      [ItemTypes.TITLE]: 'title',
      [ItemTypes.CHAPTER]: 'chapter',
      [ItemTypes.FOLIO]: '#',
      [ItemTypes.FOLIO_WITH_TOTAL]: '# (##)',
    } as Record<ItemTypes, string>,
    title: {
      [ItemTypes.COPYRIGHT]: 'Copyright statement',
      [ItemTypes.TITLE]: 'Map title',
      [ItemTypes.CHAPTER]: 'Current chapter title',
      [ItemTypes.FOLIO]: 'Folio',
      [ItemTypes.FOLIO_WITH_TOTAL]: 'Folio with total page count',
    } as Record<ItemTypes, string>,
  },
};

const style = {
  display: 'inline-block',
  border: '1px solid gray',
  borderRadius: '4px',
  padding: '0 4px',
  margin: '0 3px 0 0',
  backgroundColor: '#EEE',
  cursor: 'move',
};

interface TagProps {
  id: any;
  index: number;
  moveTag?: (dragIndex: number, hoverIndex: number, item: DragItem) => void;
  deleteTag?: (id: number) => void;
  type: ItemTypes;
  canDrop: boolean;
}

export interface DragItem {
  index: number;
  id: string;
  type: ItemTypes;
}

export const Tag: React.FC<TagProps> = ({
  id,
  index,
  moveTag,
  deleteTag,
  type,
  canDrop,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: Object.values(ItemTypes),
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      if (!moveTag) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the left
      const hoverClientY = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveTag(dragIndex, hoverIndex, item);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type, id, index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging && canDrop ? 0 : 1;
  if (canDrop) {
    drag(drop(ref));
  } else {
    drag(ref);
  }
  return (
    <div ref={ref} style={{ ...style, opacity }} title={locale.Tag.title[type]}>
      {locale.Tag.label[type]}
      {canDrop && deleteTag && <Close deleteTag={() => deleteTag(id)} />}
    </div>
  );
};

const Close = (props: { deleteTag: () => void }) => (
  <span
    style={{
      display: 'inline-block',
      fontWeight: 'bold',
      height: '16px',
      width: '16px',
      fontSize: '12px',
      lineHeight: '12px',
      cursor: 'pointer',
      padding: '0px',
      marginLeft: '10px',
      verticalAlign: 'middle',
      textAlign: 'center',
    }}
    title="Delete tag"
    onClick={() => props.deleteTag()}
  >
    &#x2715;
  </span>
);
