import React, { useState, useRef, useCallback } from 'react';
import { XYCoord } from 'dnd-core';
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Field, useFormikContext } from 'formik';
import { Values } from '../app/Model';
import { DragSourceMonitor } from 'react-dnd/lib/interfaces/monitors';
import { ItemTypes, locale, Tag } from './Tag';
import { TagContainer } from './TagContainer';

// enum ItemTypes {
//   COPYRIGHT = 'copyright',
//   TITLE = 'title',
//   CHAPTER = 'chapter',
//   FOLIO = 'folio',
//   FOLIO_WITH_TOTAL = 'folio-with-total',
// }
//
// interface DragItem {
//   index: number;
//   id: string;
//   type: ItemTypes;
// }
//
// function Tag(props: {
//   type: ItemTypes;
//   id: number;
//   index: number;
//   label: string;
//   title: string;
//   moveCard: (dragIndex: number, hoverIndex: number) => void;
//   addCard: (dragIndex: number, hoverIndex: number) => void;
// }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const [, drop] = useDrop({
//     accept: Object.values(ItemTypes),
//     // hover(item: DragItem, monitor: DropTargetMonitor) {
//     //   if (!ref.current) {
//     //     return;
//     //   }
//     //   const dragIndex = item.index;
//     //   const hoverIndex = props.index;
//     //
//     //   // Don't replace items with themselves
//     //   if (dragIndex === hoverIndex) {
//     //     return;
//     //   }
//     //
//     //   // Determine rectangle on screen
//     //   const hoverBoundingRect = ref.current?.getBoundingClientRect();
//     //   console.log(hoverBoundingRect)
//     //   // Get vertical middle
//     //   const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
//     //   // Determine mouse position
//     //   const clientOffset = monitor.getClientOffset();
//     //   // Get pixels to the top
//     //   const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;
//     //   console.log({hoverMiddleX,clientOffset, hoverClientX })
//     //
//     //   // Only perform the move when the mouse has crossed half of the items height
//     //   // When dragging downwards, only move when the cursor is below 50%
//     //   // When dragging upwards, only move when the cursor is above 50%
//     //
//     //   // Dragging downwards
//     //   if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
//     //     return;
//     //   }
//     //   // Dragging upwards
//     //   if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
//     //     return;
//     //   }
//     //   // Time to actually perform the action
//     //   // if (dragIndex === -1) {
//     //   //   props.addCard(dragIndex, hoverIndex);
//     //   // } else {
//     //     props.moveCard(dragIndex, hoverIndex);
//     //   // }
//     //
//     //   // Note: we're mutating the monitor item here!
//     //   // Generally it's better to avoid mutations,
//     //   // but it's good here for the sake of performance
//     //   // to avoid expensive index searches.
//     //   item.index = hoverIndex;
//     // },
//     hover(item: DragItem, monitor: DropTargetMonitor) {
//       if (!ref.current) {
//         return;
//       }
//       const dragIndex = item.index;
//       const hoverIndex = props.index;
//
//       // Don't replace items with themselves
//       if (dragIndex === hoverIndex) {
//         return;
//       }
//
//       // Determine rectangle on screen
//       const hoverBoundingRect = ref.current?.getBoundingClientRect();
//
//       // Get vertical middle
//       const hoverMiddleY =
//           (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
//
//       // Determine mouse position
//       const clientOffset = monitor.getClientOffset();
//
//       // Get pixels to the top
//       const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
//
//       // Only perform the move when the mouse has crossed half of the items height
//       // When dragging downwards, only move when the cursor is below 50%
//       // When dragging upwards, only move when the cursor is above 50%
//
//       // Dragging downwards
//       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
//         return;
//       }
//
//       // Dragging upwards
//       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
//         return;
//       }
//
//       // Time to actually perform the action
//       props.moveCard(dragIndex, hoverIndex);
//
//       // Note: we're mutating the monitor item here!
//       // Generally it's better to avoid mutations,
//       // but it's good here for the sake of performance
//       // to avoid expensive index searches.
//       item.index = hoverIndex;
//     }
//   });
//
//   const [{ isDragging }, drag] = useDrag({
//     item: { type: ItemTypes.TITLE, id: props.id, index: props.index },
//     collect: (monitor: DragSourceMonitor) => ({
//       isDragging: monitor.isDragging(),
//
//     }),
//   });
//
//   drag(drop(ref));
//
//   const opacity = isDragging ? 0.1 : 1;
//   return (
//     <div
//       ref={ref}
//       style={{
//         display: 'block',
//         width: '60px',
//         margin: '0 3px',
//         cursor: 'move',
//         opacity
//       }}
//       className="label label-default"
//       title={props.title}
//     >
//       {props.label}
//     </div>
//   );
// }
//
// function SourceTag(props: {
//   type: ItemTypes;
//   id: number;
//   index: number;
//   label: string;
//   title: string;
//   moveCard: (dragIndex: number, hoverIndex: number) => void;
//   addCard: (dragIndex: number, hoverIndex: number) => void;
// }) {
//   const ref = useRef<HTMLDivElement>(null);
//   // const [, drop] = useDrop({
//   //   accept: ItemTypes.TITLE,
//   //   hover(item: DragItem, monitor: DropTargetMonitor) {
//   //     if (!ref.current) {
//   //       return;
//   //     }
//   //     const dragIndex = item.index;
//   //     const hoverIndex = props.index;
//   //
//   //     // Don't replace items with themselves
//   //     if (dragIndex === hoverIndex) {
//   //       return;
//   //     }
//   //
//   //     // Determine rectangle on screen
//   //     const hoverBoundingRect = ref.current?.getBoundingClientRect();
//   //     // Get vertical middle
//   //     const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
//   //     // Determine mouse position
//   //     const clientOffset = monitor.getClientOffset();
//   //     // Get pixels to the top
//   //     const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;
//   //
//   //     // Only perform the move when the mouse has crossed half of the items height
//   //     // When dragging downwards, only move when the cursor is below 50%
//   //     // When dragging upwards, only move when the cursor is above 50%
//   //
//   //     // console.log(dragIndex,'>',hoverIndex, '&&', hoverClientX ,'>', hoverMiddleX)
//   //     // Dragging downwards
//   //     if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
//   //       return;
//   //     }
//   //     // Dragging upwards
//   //     if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
//   //       return;
//   //     }
//   //     // Time to actually perform the action
//   //     if (dragIndex === -1) {
//   //       props.addCard(dragIndex, hoverIndex);
//   //     } else {
//   //       props.moveCard(dragIndex, hoverIndex);
//   //     }
//   //
//   //     // Note: we're mutating the monitor item here!
//   //     // Generally it's better to avoid mutations,
//   //     // but it's good here for the sake of performance
//   //     // to avoid expensive index searches.
//   //     item.index = hoverIndex;
//   //   },
//   //   // collect: (monitor) => ({
//   //   //   isDragging: !!monitor.isDragging(),
//   //   // }),
//   // });
//
//   const [{ isDragging }, drag] = useDrag({
//     item: { type: props.type, id: props.id, index: props.index },
//     collect: (monitor: DragSourceMonitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });
//
//   drag(ref);
//
//   return (
//       <span
//           ref={ref}
//           style={{
//             display: 'inline-block',
//             width: '60px',
//             margin: '0 3px',
//             cursor: 'move',
//             opacity: isDragging ? 0.2 : 1
//           }}
//           className="label label-default"
//           title={props.title}
//       >
//       {props.label}
//     </span>
//   );
// }
//
// function StaticContentInput() {
//   const [cards, setCards] = useState<{ type: ItemTypes; id: number }[]>([
//     { type: ItemTypes.TITLE, id: 1 },
//     { type: ItemTypes.COPYRIGHT, id: 2 },
//     { type: ItemTypes.FOLIO, id: 3 },
//   ]);
//   // const [{ isOver }, drop] = useDrop({
//   //   accept: [
//   //     ItemTypes.COPYRIGHT,
//   //     ItemTypes.TITLE,
//   //     ItemTypes.CHAPTER,
//   //     ItemTypes.FOLIO,
//   //     ItemTypes.FOLIO_WITH_TOTAL,
//   //   ],
//   //   drop: (a, b) => {
//   //     setState((prevState) => prevState.concat(a.type as ItemTypes));
//   //     // console.log('drop', a, b);
//   //   },
//   //   collect: (monitor) => ({
//   //     isOver: !!monitor.isOver(),
//   //   }),
//   // });
//   const moveCard = useCallback(
//     (dragIndex: number, hoverIndex: number) => {
//       // console.log('moveCard', dragIndex, '->', hoverIndex);
//       setCards((prevState) => {
//         const res = Array.from(prevState)
//         const dragCard = res[dragIndex];
//         res.splice(dragIndex, 1);
//         res.splice(hoverIndex, 0, dragCard);
//         return res;
//         // update(cards, {
//         //   $splice: [
//         //     [dragIndex, 1], // remove dragIndex
//         //     [hoverIndex, 0, dragCard], // add to hoverIndex
//         //   ],
//         // }),
//       });
//     },
//     [cards]
//   );
//   const addCard = useCallback(
//       (dragIndex: number, hoverIndex: number) => {
//         console.log('addCard', dragIndex, '->', hoverIndex);
//         // setCards((prevState) => {
//         //   const res = Array.from(prevState)
//         //   const dragCard = res[dragIndex];
//         //   res.splice(dragIndex, 1);
//         //   res.splice(hoverIndex, 0, dragCard);
//         //   return res;
//         //   // update(cards, {
//         //   //   $splice: [
//         //   //     [dragIndex, 1], // remove dragIndex
//         //   //     [hoverIndex, 0, dragCard], // add to hoverIndex
//         //   //   ],
//         //   // }),
//         // });
//       },
//       [cards]
//   );
//
//   return (
//     <div
//       id="even-header"
//       style={{height: '100px'}}
//       // ref={drop}
//     >
//       {cards.map((item, i) => (
//         <Tag
//           key={i}
//           id={item.id}
//           index={i}
//           type={item.type}
//           moveCard={moveCard}
//           addCard={addCard}
//           label={item.type + " " + item.id}
//           title={item.type + " " + item.id}
//         />
//       ))}
//     </div>
//   );
// }

export default function Header() {
  const { values } = useFormikContext<Values>();
  return (
    <div className="form col-md-12">
      <h3>Header and footer</h3>
      <fieldset>
        <div>
          <label>Fields</label>
          <table className="static-content">
            <thead>
              <tr>
                <td id="header-source">
                  {Object.values(ItemTypes).map((type, i) => (
                    <Tag
                      key={i}
                      id={-1}
                      index={-1}
                      type={type}
                      canDrop={false}
                    />
                  ))}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="even">Even header:</th>
                <th>Odd header:</th>
              </tr>
              <tr>
                <td className="even">
                  <TagContainer />
                  {/*<div id="even-header" ref={drop}></div>*/}
                </td>
                <td>
                  <div id="odd-header"></div>
                </td>
              </tr>
              <tr>
                <th className="even">Even footer:</th>
                <th>Odd footer:</th>
              </tr>
              <tr>
                <td className="even">
                  <div id="even-footer"></div>
                </td>
                <td>
                  <div id="odd-footer"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="instruction">
          Drag fields for header and footer contents.
        </p>
      </fieldset>
      {/*<h3>Page numbering</h3>*/}
      <fieldset className={values.formatter !== 'ah' ? 'disabled' : undefined}>
        {values.formatter !== 'ah' && (
          <p className="xnot-available">
            Not available for FOP and RenderX XEP
          </p>
        )}
        <p>
          <label htmlFor="page_number">Page number</label>
          <Field
            component="select"
            name="page_number"
            id="page_number"
            disabled={values.formatter !== 'ah'}
          >
            <option value="page">1</option>
            <option value="chapter-page">1-1</option>
          </Field>
        </p>
        <p className="instruction">Page number format.</p>
        <p className="help">
          Either use a simple page number, or reset page numbering for each
          chapter and prefix page number with chapter number.
        </p>
      </fieldset>
    </div>
  );
}
