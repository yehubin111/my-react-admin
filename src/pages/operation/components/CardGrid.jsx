import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import styles from "./comp.module.scss";

const CardGrid = (props) => {
  const { index, moveCard, children, id, topicId } = props;

  const style = {
    backgroundColor: 'white',
    cursor: 'move',
  }
  const ref = useRef(null);
  // const ref = forwardRef(null)
  const [, drop] = useDrop({
    accept: "card",
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current && ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientX = clientOffset.x - hoverBoundingRect.left
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex, topicId)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: "card", id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref))


  return (
    // <input type="text" ref={ref}/>
    <div ref={ref} className={styles.product} style={{ ...style, opacity }}>
      {children}
    </div>
  )
}

export default CardGrid;