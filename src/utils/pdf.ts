import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPdf = async () => {
  const visualElement = document.getElementById('visual-snapshot');
  const paramElement = document.getElementById('param-snapshot');

  if (!visualElement || !paramElement) {
    alert('无法找到用于生成报告的元素。');
    return;
  }

  try {
    const visualCanvas = await html2canvas(visualElement, { useCORS: true });
    const paramCanvas = await html2canvas(paramElement);

    const visualImgData = visualCanvas.toDataURL('image/png');
    const paramImgData = paramCanvas.toDataURL('image/png');

    const pdf = new jsPDF();

    pdf.setFontSize(20);
    pdf.text('K-means 聚类实验报告', 10, 20);

    pdf.setFontSize(14);
    pdf.text('参数设置 & 结果', 10, 35);
    pdf.addImage(paramImgData, 'PNG', 10, 40, 180, 100);

    pdf.text('3D 颜色空间可视化', 10, 155);
    pdf.addImage(visualImgData, 'PNG', 10, 160, 180, 100);
    
    pdf.save(`kmeans-report-${new Date().toISOString()}.pdf`);

  } catch (error) {
    console.error('导出 PDF 时出错:', error);
    alert('导出 PDF 失败，请检查控制台获取更多信息。');
  }
}; 