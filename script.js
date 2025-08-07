// 获取画布和上下文
const referenceCanvas = document.getElementById('referenceCanvas');
const drawingCanvas = document.getElementById('drawingCanvas');
const toggleButton = document.getElementById('toggleButton');
const gridInput = document.getElementById('gridInput');
const curveCountInput = document.getElementById('curveCountInput');
const refCtx = referenceCanvas.getContext('2d');
const drawCtx = drawingCanvas.getContext('2d');

// 设置画布尺寸
function resizeCanvas() {
    // 获取容器尺寸
    const refContainer = referenceCanvas.parentElement;
    const drawContainer = drawingCanvas.parentElement;
    
    // 设置画布尺寸为容器尺寸
    referenceCanvas.width = refContainer.clientWidth;
    referenceCanvas.height = refContainer.clientHeight;
    
    drawingCanvas.width = drawContainer.clientWidth;
    drawingCanvas.height = drawContainer.clientHeight;
    
    // 重新绘制内容（仅在已生成控制点时）
    if (controlPoints.length > 0) {
        showReferenceCurve();
        
        // 重新绘制用户画布的辅助线
        const gridSize = parseInt(gridInput.value) + 1;
        clearCanvas(drawingCanvas, drawCtx);
        drawGridLines(drawingCanvas, drawCtx, gridSize);
    }
}

// 设置画笔样式
refCtx.strokeStyle = '#000';
refCtx.lineWidth = 2;

drawCtx.strokeStyle = '#333';
drawCtx.lineWidth = 2;

drawCtx.lineCap = 'round';
drawCtx.lineJoin = 'round';

// 当前控制点
let controlPoints = [];

// 生成随机控制点
function generateControlPoints() {
    const curveCount = parseInt(curveCountInput.value);
    controlPoints = [];
    
    // 生成第一条曲线的起始点（在整个画布范围内随机）
    const startX = Math.random() * 400 + 50;
    const startY = Math.random() * 400 + 50;
    controlPoints.push([
        { x: startX, y: startY },
        { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
        { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
        { x: 450, y: 250 }
    ]);
    
    // 生成额外的曲线
    for (let i = 1; i < curveCount; i++) {
        const prevCurve = controlPoints[i - 1];
        const prevEnd = prevCurve[3]; // 上一条曲线的终点
        
        controlPoints.push([
            { x: prevEnd.x, y: prevEnd.y }, // 新曲线的起点是上一条曲线的终点
            { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
            { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
            { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 }
        ]);
    }
}

// 绘制贝塞尔曲线
function drawBezierCurve(ctx, points) {
    // 如果points是一个包含多条曲线的数组
    if (Array.isArray(points[0])) {
        points.forEach(curvePoints => {
            ctx.beginPath();
            ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
            ctx.bezierCurveTo(
                curvePoints[1].x, curvePoints[1].y,
                curvePoints[2].x, curvePoints[2].y,
                curvePoints[3].x, curvePoints[3].y
            );
            ctx.stroke();
        });
    } else {
        // 如果points是单条曲线的控制点
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.bezierCurveTo(
            points[1].x, points[1].y,
            points[2].x, points[2].y,
            points[3].x, points[3].y
        );
        ctx.stroke();
    }
}

// 清除画布
function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 绘制虚线辅助线
function drawGridLines(canvas, ctx, gridSize) {
    const width = canvas.width;
    const height = canvas.height;
    
    // 设置虚线样式
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]); // 5px虚线，5px间隔
    
    // 绘制垂直线
    for (let i = 1; i < gridSize; i++) {
        const x = (width / gridSize) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // 绘制水平线
    for (let i = 1; i < gridSize; i++) {
        const y = (height / gridSize) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // 重置虚线样式
    ctx.setLineDash([]);
}

// 显示参考曲线
function showReferenceCurve() {
    clearCanvas(referenceCanvas, refCtx);
    // 绘制辅助线
    const gridSize = parseInt(gridInput.value) + 1;
    drawGridLines(referenceCanvas, refCtx, gridSize);
    drawBezierCurve(refCtx, controlPoints);
}

// 用户绘制功能
// 用户绘制功能
let isDrawing = false;

// 触摸事件处理函数
function handleTouchStart(e) {
    e.preventDefault();
    isDrawing = true;
    drawCtx.beginPath();
    const rect = drawingCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    drawCtx.moveTo(x, y);
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isDrawing) return;
    const rect = drawingCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    drawCtx.lineTo(x, y);
    drawCtx.stroke();
}

function handleTouchEnd(e) {
    e.preventDefault();
    isDrawing = false;
}

function startDrawing(e) {
    isDrawing = true;
    drawCtx.beginPath();
    const rect = drawingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawCtx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = drawingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawCtx.lineTo(x, y);
    drawCtx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

// 显示对比
function showComparison() {
    // 在用户绘制的画布上用红色显示参考曲线
    refCtx.strokeStyle = '#cc0000';
    refCtx.lineWidth = 2;
    drawBezierCurve(refCtx, controlPoints);
    refCtx.strokeStyle = '#000'; // 恢复原始颜色
}

// 初始化
function init() {
    // 设置初始画布尺寸
    resizeCanvas();
    
    generateControlPoints();
    showReferenceCurve();
    
    // 添加鼠标事件监听器
    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mousemove', draw);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mouseout', stopDrawing);
    
    // 添加触摸事件监听器
    drawingCanvas.addEventListener('touchstart', handleTouchStart);
    drawingCanvas.addEventListener('touchmove', handleTouchMove);
    drawingCanvas.addEventListener('touchend', handleTouchEnd);
    
    // 添加窗口大小改变事件监听器
    window.addEventListener('resize', resizeCanvas);
    
    // 按钮状态切换功能
    let isCompleted = false;
    
    toggleButton.addEventListener('click', () => {
        if (!isCompleted) {
            // 完成状态：在右侧框用红色显示原始曲线，左侧框保持不变
            drawCtx.strokeStyle = '#cc0000';
            drawCtx.lineWidth = 2;
            drawBezierCurve(drawCtx, controlPoints);
            drawCtx.strokeStyle = '#000'; // 恢复原始颜色
            toggleButton.textContent = '继续';
            isCompleted = true;
        } else {
            // 继续状态：生成新曲线并更新左侧框
            clearCanvas(drawingCanvas, drawCtx);
            // 绘制辅助线
            const gridSize = parseInt(gridInput.value) + 1;
            drawGridLines(drawingCanvas, drawCtx, gridSize);
            generateControlPoints();
            showReferenceCurve();
            toggleButton.textContent = '完成';
            isCompleted = false;
        }
    });
    
    // 输入框事件
    gridInput.addEventListener('change', () => {
        showReferenceCurve();
        // 重新绘制用户画布的辅助线
        const gridSize = parseInt(gridInput.value) + 1;
        clearCanvas(drawingCanvas, drawCtx);
        drawGridLines(drawingCanvas, drawCtx, gridSize);
    });
    
    // 曲线数量输入框事件
    curveCountInput.addEventListener('change', () => {
        generateControlPoints();
        showReferenceCurve();
        // 重新绘制用户画布的辅助线
        const gridSize = parseInt(gridInput.value) + 1;
        clearCanvas(drawingCanvas, drawCtx);
        drawGridLines(drawingCanvas, drawCtx, gridSize);
    });
    
    // 初始绘制用户画布的辅助线
    const gridSize = parseInt(gridInput.value) + 1;
    drawGridLines(drawingCanvas, drawCtx, gridSize);
}

// 页面加载完成后初始化
window.addEventListener('load', init);