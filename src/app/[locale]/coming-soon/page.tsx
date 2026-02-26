'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function ComingSoonPage() {
  const t = useTranslations();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 设置 canvas 尺寸
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      // 初始设置
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      class Circle {
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

        drawLine(ctx: CanvasRenderingContext2D, _circle: Circle) {
          let dx = this.x - _circle.x;
          let dy = this.y - _circle.y;
          let d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(_circle.x, _circle.y);
            ctx.closePath();
            ctx.strokeStyle = 'rgba(204, 204, 204, 0.3)';
            ctx.stroke();
          }
        }

        move() {
          const w = window.innerWidth;
          const h = window.innerHeight;
          this._mx = (this.x < w && this.x > 0) ? this._mx : (-this._mx);
          this._my = (this.y < h && this.y > 0) ? this._my : (-this._my);
          this.x += this._mx / 2;
          this.y += this._my / 2;
        }
      }

      class CurrentCircle extends Circle {
        drawCircle(ctx: CanvasRenderingContext2D) {
          ctx.beginPath();
          this.r = 8;
          ctx.arc(this.x, this.y, this.r, 0, 360);
          ctx.closePath();
          ctx.fillStyle = 'rgba(109, 163, 201, 0.6)';
          ctx.fill();
        }
      }

      const circles: Circle[] = [];
      const currentCircle = new CurrentCircle(0, 0);

      const draw = () => {
        if (!ctx) return;
        const w = window.innerWidth;
        const h = window.innerHeight;

        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < circles.length; i++) {
          circles[i].move();
          circles[i].drawCircle(ctx);
          for (let j = i + 1; j < circles.length; j++) {
            circles[i].drawLine(ctx, circles[j]);
          }
        }
        if (currentCircle.x && currentCircle.y) {
          currentCircle.drawCircle(ctx);
          for (let k = 0; k < circles.length; k++) {
            currentCircle.drawLine(ctx, circles[k]);
          }
        }
        requestAnimationFrame(draw);
      };

      const init = (num: number) => {
        for (let i = 0; i < num; i++) {
          circles.push(new Circle(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
        }
      };

      // 鼠标移动事件
      const handleMouseMove = (e: MouseEvent) => {
        currentCircle.x = e.clientX;
        currentCircle.y = e.clientY;
      };

      const handleMouseOut = () => {
        currentCircle.x = 0;
        currentCircle.y = 0;
      };

      // 初始化
      init(60);
      draw();

      // 添加事件监听器
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseout', handleMouseOut);

      // 清理函数
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white flex items-center justify-center">
      <canvas 
        ref={canvasRef}
        className="background-canvas absolute top-0 left-0 w-full h-full"
      />
      <div className="content relative z-10 flex flex-col items-center justify-center text-center px-4">
        <h1 className="main-title text-6xl md:text-7xl font-bold text-gray-800 mb-6">
          {t('comingSoon.title')}
        </h1>
        <p className="subtitle text-2xl md:text-3xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
          {t('comingSoon.description')}
        </p>
        <Button 
          variant="default" 
          className="back-button px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          asChild
        >
          <Link href="/">{t('comingSoon.backToHome')}</Link>
        </Button>
      </div>
      <style jsx global>{`
        .background-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .content {
          backdrop-filter: blur(5px);
          background-color: rgba(255, 255, 255, 0.2);
          padding: 2rem;
          border-radius: 1rem;
          margin: 2rem;
        }

        .main-title {
          color: #5a7d9a;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
        }

        .subtitle {
          color: #7b96b5;
          max-width: 80%;
          line-height: 1.6;
        }

        .back-button {
          background-color: #6da3c9;
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          letter-spacing: 1px;
        }

        .back-button:hover {
          background-color: #5a8fb9;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .main-title {
            font-size: 2.5rem;
          }
          
          .subtitle {
            font-size: 1.3rem;
          }
          
          .back-button {
            padding: 12px 24px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}