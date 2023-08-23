import React, { useRef, useState } from 'react';
import { effectHook } from '@/utils/hooks';

/**
 * @default
 * @export
 * @param [props]
 * @return {JSX.Element}
 * @constructor
 * @link https://developer.mozilla.org/en-US/blog/javascript-shape-drawing-function/
 * @example
 *  <CanvasShape shapes={[
 *    [
 *      100, 100, 50, 15, {
 *        globalAlpha: 0.5,
 *        fill: { fillStyle: 'pink' },
 *        stroke: { strokeStyle: 'blue', lineWidth: 4, lineJoin: 'miter' },
 *        shadow: { shadowBlur: 10, shadowColor: 'red', shadowOffsetX: 10, shadowOffsetY: 10 }
 *      }]
 *    ]}/>
 */
const CanvasShape = (props = {}) => {
  const {
    className,
    width = 400,
    height = 200,
    shapes = []
  } = props;

  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  effectHook(() => {
    if (canvasRef?.current) {
      initCanvas();
    }
  }, [canvasRef?.current]);

  effectHook(() => {
    if (ctx) {
      shapes.forEach(shape => {
        drawShape.apply(null, shape);
      });
    }
  }, [ctx]);

  /**
   * @constant
   */
  const initCanvas = () => {
    const canvas = document.querySelector('canvas');

    if (canvas) {
      canvas.width = width;
      canvas.height = height;

      setCtx(canvas.getContext('2d'));
    }
  };

  /**
   * @constant
   * @param {number} x - Figure out the x (horizontal) position of points around the center, which when joined with a line, will make six equal sides.
   * @param {number} y - Figure out the y (vertical) position of points around the center, which when joined with a line, will make six equal sides.
   * @param {number} r - Shape radius.
   * @param {number} sides - Drawing a shape with any number of sides.
   * @param {object} [props] - Fill/Stroke/Shadow props.
   */
  const drawShape = (x, y, r, sides, props = {}) => {
    const {
      // Specifies the alpha (transparency) value that is applied to shapes and images before they are drawn onto the canvas.
      globalAlpha = 1,
      fill = {
        // fillStyle: 'white'
      },
      stroke = {
        // There are three possible values for this property: "round", "bevel", and "miter". The default is "miter".
        // lineJoin: 'miter',
        // lineWidth: 1,
        // strokeStyle: 'black'
      },
      shadow = {
        // Specifies the amount of blur applied to shadows. The default is 0 (no blur).
        // shadowBlur: 0,
        // Specifies the color of shadows.
        // shadowColor: 'red',
        // Specifies the distance that shadows will be offset horizontally.
        // shadowOffsetX: 10,
        // Specifies the distance that shadows will be offset vertically.
        // shadowOffsetY: 10
      }
    } = props;

    // move the canvas to the center position
    ctx.translate(x, y);

    for (let i = 0; i < sides; i++) {
      // calculate the rotation
      const rotation = ((Math.PI * 2) / sides) * i;

      // for the first point move to
      if (i === 0) {
        ctx.moveTo(r * Math.cos(rotation), r * Math.sin(rotation));
      } else {
        // for the rest draw a line
        ctx.lineTo(r * Math.cos(rotation), r * Math.sin(rotation));
      }
    }

    // close path and stroke it
    ctx.closePath();

    // Sub-path
    stroke?.strokeStyle && (ctx.strokeStyle = stroke?.strokeStyle);
    stroke?.lineWidth && (ctx.lineWidth = stroke?.lineWidth);
    stroke?.lineJoin && (ctx.lineJoin = stroke?.lineJoin);

    globalAlpha && (ctx.globalAlpha = globalAlpha);

    shadow?.shadowBlur && (ctx.shadowBlur = shadow?.shadowBlur);
    shadow?.shadowColor && (ctx.shadowColor = shadow?.shadowColor);
    shadow?.shadowOffsetX && (ctx.shadowOffsetX = shadow?.shadowOffsetX);
    shadow?.shadowOffsetY && (ctx.shadowOffsetY = shadow?.shadowOffsetY);

    ctx.stroke();

    if (fill?.fillStyle) {
      // Fill path
      ctx.fillStyle = fill?.fillStyle;
      ctx.fill();
    }

    // reset the translation position
    ctx.resetTransform();
  };

  return (
      <div className={className}>
        <canvas ref={canvasRef}></canvas>
      </div>
  );
};

export default CanvasShape;
