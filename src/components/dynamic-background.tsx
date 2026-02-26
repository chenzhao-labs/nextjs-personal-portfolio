'use client';

import { useEffect, useRef } from 'react';

interface Circle {
  x: number;
  y: number;
  r: number;
  _mx: number;
  _my: number;
}

class CurrentCircle implements Circle {
  x: number;
  y: number;
  r: number;
  _mx: number;
  _my: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.r = 8;
    this._mx = 0;
    this._my = 0;
  }

  drawCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 360);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 77, 54, 0.6)';
    ctx.fill();
  }

  drawLine(ctx: CanvasRenderingContext2D, circle: Circle) {
    const dx = this.x - circle.x;
    const dy = this.y - circle.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    
    if (d < 150) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(circle.x, circle.y);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(204, 204, 204, 0.3)';
      ctx.stroke();
    }
  }
}

class DynamicCircle implements Circle {
  x: number;
  y: number;
  r: number;
  _mx: number;
  _my: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.r = Math.random() * 10;
    this._mx = Math.random();
    this._my = Math.random();
  }

  drawCircle(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 360);
    ctx.closePath();
    ctx.fillStyle = 'rgba(204, 204, 204, 0.3)';
    ctx.fill();
  }

  drawLine(ctx: CanvasRenderingContext2D, circle: Circle) {
    const dx = this.x - circle.x;
    const dy = this.y - circle.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    
    if (d < 150) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(circle.x, circle.y);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(204, 204, 204, 0.3)';
      ctx.stroke();
    }
  }

  move(w: number, h: number) {
    this._mx = (this.x < w && this.x > 0) ? this._mx : (-this._mx);
    this._my = (this.y < h && this.y > 0) ? this._my : (-this._my);
    this.x += this._mx / 2;
    this.y += this._my / 2;
  }
}

const DynamicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸为窗口尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 初始化圆圈数组
    const circles: DynamicCircle[] = [];
    const currentCircle = new CurrentCircle(0, 0);
    
    // 创建初始圆圈
    const init = (num: number) => {
      for (let i = 0; i < num; i++) {
        circles.push(
          new DynamicCircle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
          )
        );
      }
    };

    // 绘制函数
    const draw = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 更新和绘制动态圆圈
      for (let i = 0; i < circles.length; i++) {
        circles[i].move(canvas.width, canvas.height);
        circles[i].drawCircle(ctx);
        
        // 绘制连接线
        for (let j = i + 1; j < circles.length; j++) {
          circles[i].drawLine(ctx, circles[j]);
        }
      }
      
      // 绘制鼠标附近的圆圈
      if (currentCircle.x || currentCircle.y) {
        currentCircle.drawCircle(ctx);
        for (let k = 0; k < circles.length; k++) {
          currentCircle.drawLine(ctx, circles[k]);
        }
      }
      
      requestAnimationFrame(draw);
    };

    // 鼠标移动事件
    const handleMouseMove = (e: MouseEvent) => {
      currentCircle.x = e.clientX;
      currentCircle.y = e.clientY;
    };

    // 鼠标离开事件
    const handleMouseOut = () => {
      currentCircle.x = 0;
      currentCircle.y = 0;
    };

    init(60);
    draw();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />
  );
};

export default DynamicBackground;