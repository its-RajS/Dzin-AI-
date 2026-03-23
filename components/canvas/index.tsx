 "use client"

import { useCanvasContext } from "@/context/canvas-provider";
import React, { useState } from "react";
import { CanvasLoader } from "./canvas-loader";
import { cn } from "@/packages/utils/lib/utils";
import FloatingToolBar from "./canvas-floating-toolbar";
import { TOOL_HAND_ENUM, ToolModeType } from "@/constants/canvas";
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch"
import CanvasControl from "./canvas-control";
import DeviceFrame from "./device-frames";
import DeviceFrameSkeleton from "./device-frame-skeleton";

// const DEMO_HTML = `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8" />
// <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
// <title>FitTrack – Alex Runner</title>
// <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
// <style>
//   :root {
//     --background: #0d0f14;
//     --foreground: #f0f2f8;
//     --muted: #1e2130;
//     --muted-foreground: #6b7494;
//     --primary: #6c63ff;
//     --primary-glow: rgba(108,99,255,0.35);
//     --accent: #ff6b6b;
//     --accent2: #43e97b;
//     --card: #13151f;
//     --border: rgba(108,99,255,0.15);
//     --radius: 20px;
//   }
//   * { box-sizing: border-box; margin: 0; padding: 0; }
//   body {
//     background: var(--background);
//     color: var(--foreground);
//     font-family: 'DM Sans', sans-serif;
//     min-height: 100vh;
//     padding: 24px 20px;
//     overflow-x: hidden;
//   }
 
//   /* ── Header ── */
//   header {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 32px;
//   }
//   header .greeting p {
//     color: var(--muted-foreground);
//     font-size: 11px;
//     text-transform: uppercase;
//     letter-spacing: .18em;
//     font-weight: 600;
//     margin-bottom: 2px;
//   }
//   header .greeting h1 {
//     font-family: 'Syne', sans-serif;
//     font-size: 22px;
//     font-weight: 800;
//     color: var(--foreground);
//     letter-spacing: -.02em;
//   }
//   .avatar-wrap {
//     width: 48px; height: 48px;
//     border-radius: 50%;
//     border: 2px solid var(--primary);
//     padding: 2px;
//     overflow: hidden;
//     box-shadow: 0 0 14px var(--primary-glow);
//   }
//   .avatar-wrap img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
 
//   /* ── Central Progress Ring ── */
//   .ring-section {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin-bottom: 28px;
//   }
//   .ring-outer {
//     position: relative;
//     width: 220px; height: 220px;
//     display: flex; align-items: center; justify-content: center;
//   }
//   .ring-glow {
//     position: absolute;
//     inset: 0;
//     background: var(--primary);
//     opacity: .12;
//     filter: blur(40px);
//     border-radius: 50%;
//     transform: scale(.75);
//   }
//   .ring-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
 
//   /* Background track */
//   .track-steps    { fill: none; stroke: var(--muted); stroke-width: 8; }
//   .track-calories { fill: none; stroke: var(--muted); stroke-width: 6; }
 
//   /* Progress arcs */
//   .arc-steps {
//     fill: none;
//     stroke: var(--primary);
//     stroke-width: 8;
//     stroke-linecap: round;
//     stroke-dasharray: 753.6;
//     stroke-dashoffset: 188;
//     filter: drop-shadow(0 0 6px var(--primary));
//     transition: stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1);
//   }
//   .arc-calories {
//     fill: none;
//     stroke: var(--accent);
//     stroke-width: 6;
//     stroke-linecap: round;
//     stroke-dasharray: 628;
//     stroke-dashoffset: 220;
//     filter: drop-shadow(0 0 5px var(--accent));
//     transition: stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1) .2s;
//   }
 
//   /* Centre text */
//   .ring-label {
//     position: absolute;
//     display: flex; flex-direction: column;
//     align-items: center; justify-content: center;
//     text-align: center;
//   }
//   .ring-label .steps-val {
//     font-family: 'Syne', sans-serif;
//     font-size: 42px; font-weight: 800;
//     color: var(--foreground);
//     line-height: 1;
//   }
//   .ring-label .steps-unit {
//     font-size: 12px; color: var(--muted-foreground);
//     letter-spacing: .1em; text-transform: uppercase; margin-top: 2px;
//   }
//   .ring-label .cal-val {
//     font-size: 13px; color: var(--accent);
//     font-weight: 600; margin-top: 6px;
//   }
//   .ring-label .goal-pct {
//     font-size: 11px; color: var(--muted-foreground); margin-top: 1px;
//   }
 
//   /* ── Stat Pills ── */
//   .stat-row {
//     display: flex; gap: 12px;
//     margin-bottom: 24px;
//     width: 100%; max-width: 380px;
//     align-self: center;
//   }
//   .stat-pill {
//     flex: 1; background: var(--card);
//     border: 1px solid var(--border);
//     border-radius: 14px;
//     padding: 14px 12px;
//     display: flex; flex-direction: column; gap: 4px;
//     position: relative; overflow: hidden;
//   }
//   .stat-pill::before {
//     content: '';
//     position: absolute; top: 0; left: 0; right: 0; height: 2px;
//     background: var(--pill-color, var(--primary));
//     opacity: .8;
//   }
//   .stat-pill .pill-icon { font-size: 18px; margin-bottom: 2px; }
//   .stat-pill .pill-val {
//     font-family: 'Syne', sans-serif;
//     font-size: 20px; font-weight: 700; color: var(--foreground);
//   }
//   .stat-pill .pill-label {
//     font-size: 10px; color: var(--muted-foreground);
//     text-transform: uppercase; letter-spacing: .1em;
//   }
 
//   /* ── Weekly Bar Chart ── */
//   .section-card {
//     background: var(--card);
//     border: 1px solid var(--border);
//     border-radius: var(--radius);
//     padding: 20px;
//     margin-bottom: 16px;
//     max-width: 380px; width: 100%; align-self: center;
//   }
//   .section-header {
//     display: flex; justify-content: space-between; align-items: center;
//     margin-bottom: 16px;
//   }
//   .section-header h2 {
//     font-family: 'Syne', sans-serif;
//     font-size: 15px; font-weight: 700;
//   }
//   .section-header span {
//     font-size: 11px; color: var(--primary);
//     font-weight: 600; cursor: pointer;
//   }
 
//   .bar-chart {
//     display: flex; gap: 10px; align-items: flex-end;
//     height: 80px;
//   }
//   .bar-col {
//     flex: 1; display: flex; flex-direction: column;
//     align-items: center; gap: 6px;
//   }
//   .bar-bg {
//     width: 100%; background: var(--muted);
//     border-radius: 6px; flex: 1;
//     position: relative; overflow: hidden;
//   }
//   .bar-fill {
//     position: absolute; bottom: 0; left: 0; right: 0;
//     border-radius: 6px;
//     background: var(--bar-color, var(--primary));
//     transition: height 1.2s cubic-bezier(.4,0,.2,1);
//   }
//   .bar-fill.active {
//     background: var(--primary);
//     box-shadow: 0 0 8px var(--primary-glow);
//   }
//   .bar-day {
//     font-size: 10px; color: var(--muted-foreground);
//     text-transform: uppercase; letter-spacing: .05em;
//   }
 
//   /* ── Activity List ── */
//   .activity-item {
//     display: flex; align-items: center; gap: 14px;
//     padding: 10px 0;
//     border-bottom: 1px solid rgba(255,255,255,.04);
//   }
//   .activity-item:last-child { border-bottom: none; padding-bottom: 0; }
//   .act-icon {
//     width: 40px; height: 40px; border-radius: 12px;
//     display: flex; align-items: center; justify-content: center;
//     font-size: 18px;
//     background: var(--act-bg, var(--muted));
//     flex-shrink: 0;
//   }
//   .act-info { flex: 1; }
//   .act-info .act-name { font-size: 14px; font-weight: 500; color: var(--foreground); }
//   .act-info .act-sub  { font-size: 11px; color: var(--muted-foreground); margin-top: 1px; }
//   .act-val { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--foreground); }
 
//   /* layout wrapper */
//   .page { max-width: 420px; margin: 0 auto; display: flex; flex-direction: column; }
 
//   /* ── Animations ── */
//   @keyframes fadeUp {
//     from { opacity: 0; transform: translateY(18px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
//   header           { animation: fadeUp .5s ease both; }
//   .ring-section    { animation: fadeUp .6s .1s ease both; }
//   .stat-row        { animation: fadeUp .6s .2s ease both; }
//   .section-card:nth-child(1) { animation: fadeUp .6s .3s ease both; }
//   .section-card:nth-child(2) { animation: fadeUp .6s .4s ease both; }
// </style>
// </head>
// <body>
// <div class="page">
 
//   <!-- Header -->
//   <header>
//     <div class="greeting">
//       <p>Welcome Back</p>
//       <h1>Alex Runner</h1>
//     </div>
//     <div class="avatar-wrap">
//       <img src="https://i.pravatar.cc/150?img=11" alt="User" />
//     </div>
//   </header>
 
//   <!-- Central Ring -->
//   <div class="ring-section">
//     <div class="ring-outer">
//       <div class="ring-glow"></div>
//       <svg class="ring-svg" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
//         <!-- Steps track + arc (r=100) -->
//         <circle class="track-steps"    cx="128" cy="128" r="100"/>
//         <circle class="arc-steps"      cx="128" cy="128" r="100"/>
//         <!-- Calories track + arc (r=80) -->
//         <circle class="track-calories" cx="128" cy="128" r="80"/>
//         <circle class="arc-calories"   cx="128" cy="128" r="80"/>
//       </svg>
//       <div class="ring-label">
//         <span class="steps-val" id="stepsCounter">0</span>
//         <span class="steps-unit">steps</span>
//         <span class="cal-val">🔥 482 kcal</span>
//         <span class="goal-pct">75% of goal</span>
//       </div>
//     </div>
//   </div>
 
//   <!-- Stat Pills -->
//   <div class="stat-row">
//     <div class="stat-pill" style="--pill-color:#6c63ff">
//       <div class="pill-icon">🏃</div>
//       <div class="pill-val">5.4<small style="font-size:13px;font-weight:400"> km</small></div>
//       <div class="pill-label">Distance</div>
//     </div>
//     <div class="stat-pill" style="--pill-color:#ff6b6b">
//       <div class="pill-icon">❤️</div>
//       <div class="pill-val">118 <small style="font-size:13px;font-weight:400">bpm</small></div>
//       <div class="pill-label">Heart Rate</div>
//     </div>
//     <div class="stat-pill" style="--pill-color:#43e97b">
//       <div class="pill-icon">⏱</div>
//       <div class="pill-val">42<small style="font-size:13px;font-weight:400"> min</small></div>
//       <div class="pill-label">Active</div>
//     </div>
//   </div>
 
//   <!-- Weekly Chart -->
//   <div class="section-card">
//     <div class="section-header">
//       <h2>Weekly Steps</h2>
//       <span>This Week</span>
//     </div>
//     <div class="bar-chart" id="barChart">
//       <!-- filled by JS -->
//     </div>
//   </div>
 
//   <!-- Recent Activity -->
//   <div class="section-card">
//     <div class="section-header">
//       <h2>Recent Activity</h2>
//       <span>See All</span>
//     </div>
 
//     <div class="activity-item">
//       <div class="act-icon" style="--act-bg:rgba(108,99,255,.18)">🏃</div>
//       <div class="act-info">
//         <div class="act-name">Morning Run</div>
//         <div class="act-sub">Today · 7:14 AM</div>
//       </div>
//       <div class="act-val">5.4 km</div>
//     </div>
 
//     <div class="activity-item">
//       <div class="act-icon" style="--act-bg:rgba(255,107,107,.18)">🚴</div>
//       <div class="act-info">
//         <div class="act-name">Cycling</div>
//         <div class="act-sub">Yesterday · 6:30 PM</div>
//       </div>
//       <div class="act-val">18 km</div>
//     </div>
 
//     <div class="activity-item">
//       <div class="act-icon" style="--act-bg:rgba(67,233,123,.18)">🧘</div>
//       <div class="act-info">
//         <div class="act-name">Yoga Session</div>
//         <div class="act-sub">Mon · 8:00 AM</div>
//       </div>
//       <div class="act-val">35 min</div>
//     </div>
//   </div>
 
// </div>
 
// <script>
//   // Animate step counter
//   const target = 7540;
//   const el = document.getElementById('stepsCounter');
//   let start = null;
//   function countUp(ts) {
//     if (!start) start = ts;
//     const p = Math.min((ts - start) / 1400, 1);
//     el.textContent = Math.floor(p * target).toLocaleString();
//     if (p < 1) requestAnimationFrame(countUp);
//   }
//   requestAnimationFrame(countUp);
 
//   // Bar chart
//   const days = ['M','T','W','T','F','S','S'];
//   const vals = [62, 80, 45, 90, 55, 100, 75]; // percentages
//   const chart = document.getElementById('barChart');
//   days.forEach((d, i) => {
//     const col = document.createElement('div');
//     col.className = 'bar-col';
//     const bg = document.createElement('div');
//     bg.className = 'bar-bg';
//     const fill = document.createElement('div');
//     fill.className = 'bar-fill' + (i === 5 ? ' active' : '');
//     fill.style.height = "0%";
//     fill.style.setProperty("--bar-color", i === 5 ? "var(--primary)" : "rgba(108,99,255,.45)");
//     bg.appendChild(fill);
//     const lbl = document.createElement('div');
//     lbl.className = 'bar-day';
//     lbl.textContent = d;
//     col.appendChild(bg);
//     col.appendChild(lbl);
//     chart.appendChild(col);
//     setTimeout(() => { fill.style.height = vals[i] + '%'; }, 400 + i * 60);
//   });
// </script>
// </body>
// </html>`

const Canvas = ({
  projectId,
  projectName,
  isPending,
}: {
  projectId: string;
  projectName: string | null;
  isPending: boolean;
}) => {
  const { theme, frames, selectedFrame, setSelectedFrameId, loadingStatus } =
    useCanvasContext();

  const currentStatus = isPending
    ? "fetching" 
    : loadingStatus !== "idle" && loadingStatus !== "complete" ? "generating" : "idle";
 
  const [toolMode, setToolMode] = useState<ToolModeType>(
    TOOL_HAND_ENUM.SELECT 
  )
  const [zoomPercent, setZoomPercent] = useState<number>(53)
  const [currentScale, setCurrentScale] = useState<number>(0.53)
  
  return ( 
    <>
      {/* Outer wrapper with dark background and rounded corners */}
      <div className="relative h-full w-full overflow-hidden bg-[#1f1f1f] rounded-3xl p-4">
        <FloatingToolBar />

        {/* Status Loader */}
        {currentStatus && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <CanvasLoader status={currentStatus} />
          </div>
        )}

        {/* //? Zoom Menu */}
        <TransformWrapper
        initialScale={0.53}
        initialPositionX={40}
        initialPositionY={5}
        minScale={0.1}
        maxScale={3}
        wheel={{step: 0.1}}
        pinch={{step: 0.1}}
        doubleClick={{disabled: true}}
        smooth={true}
        centerOnInit={false}
        centerZoomedOut={false}
        limitToBounds={false }
        onTransformed={(ref) => {
          setZoomPercent(Math.round(ref.state.scale * 100))
          setCurrentScale(ref.state.scale)
        }}
        panning={{
          disabled: toolMode !== TOOL_HAND_ENUM.HAND
        }}
        >
          {({ zoomIn, zoomOut }) => {
            const handleZoomIn = () => zoomIn(0.1)
            const handleZoomOut = () => zoomOut(0.1)

            return (
            <>
              {/* Canvas background with dotted grid */}
              <div
                className={cn(
                  "absolute inset-0 w-full h-full p-3 bg-white dark:bg-[#191919] z-0 rounded-2xl",
                  toolMode === TOOL_HAND_ENUM.HAND
                    ? "cursor-grab active:cursor-grabbing"
                    : "cursor-default"
                )}
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(0,0,0,0.75) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "10px 10px",
                }}
              >
                  <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                    overflow: "unset"
                  }}
                  
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                  >
                    <div>
                      {frames?.map((frame, index)=>{
                        const baseX = 1000 + index * 100
                        const y = 100

                        if(frame.iLoading){
                          return ( 
                            <DeviceFrameSkeleton
                            key={index}
                            style={{
                              transform: `translate(${baseX}px 100px)`
                            }}
                            />
                          )
                        }

                        return (
                          <DeviceFrame
                          key={frame.id}
                            frameId={frame.id}
                            title={frame.title}
                            html={frame.htmlContent}
                            initialPostion={{
                              x:baseX, y
                            }}
                            tool_mode={toolMode}
                            theme_style={theme?.style}
                            scale={currentScale}
                          />
                        )
                      })}
                    </div>
                  </TransformComponent>
              </div>
              <CanvasControl
                zoomIn={handleZoomIn}
                zoomOut={handleZoomOut}
                zoomPercent={zoomPercent}
                toolMode={toolMode}
                setToolMode={setToolMode}
              />
            </>
            )
          }} 
  
        </TransformWrapper>

      </div>
    </>
  );
};

export default Canvas;
