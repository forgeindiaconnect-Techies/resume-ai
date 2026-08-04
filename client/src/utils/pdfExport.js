import html2pdf from 'html2pdf.js';
import toast from 'react-hot-toast';

export const generateProfessionalFilename = (name, jobTitle) => {
  const cleanName = (name && name.trim() && name !== 'Your Name')
    ? name.trim().replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_')
    : 'Professional';
  const cleanTitle = (jobTitle && jobTitle.trim())
    ? jobTitle.trim().replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_')
    : 'Resume';
  return `${cleanName}_${cleanTitle}.pdf`;
};

export const exportResumeToPdf = async (elementOrId, filename = 'My_Resume.pdf', isPremium = true) => {
  let element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  if (!element && typeof document !== 'undefined') {
    element = document.getElementById('resume-preview-sheet') || document.querySelector('.print-paper-sheet');
  }

  if (!element) {
    console.warn('Resume container element not found. Falling back to print mode.');
    window.print();
    return;
  }

  const toastId = toast.loading('Preparing high-resolution A4 PDF...');

  // Backup original preview transformation styles
  const origTransform = element.style.transform;
  const origBoxShadow = element.style.boxShadow;
  const origMarginBottom = element.style.marginBottom;
  const origPosition = element.style.position;
  const origBorder = element.style.border;
  const origMaxHeight = element.style.maxHeight;
  const origHeight = element.style.height;
  const origOverflow = element.style.overflow;

  // Optional Watermark for non-premium users
  let watermarkEl = null;
  if (!isPremium) {
    watermarkEl = document.createElement('div');
    watermarkEl.className = 'pdf-watermark';
    watermarkEl.innerText = 'Created with Forge India Connect • Free Version';
    watermarkEl.style.cssText = `
      position: absolute;
      bottom: 12mm;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      pointer-events: none;
      z-index: 99;
    `;
    element.appendChild(watermarkEl);
  }

  try {
    // Hide focus outlines and reset scaling
    element.classList.add('exporting-pdf');
    element.style.transform = 'none';
    element.style.boxShadow = 'none';
    element.style.marginBottom = '0';
    element.style.border = 'none';

    // Prevent extra trailing blank page: if content height fits 1 A4 page (<= 1160px), clamp height to exactly 297mm
    const clientHeight = element.clientHeight;
    if (clientHeight <= 1160) {
      element.style.maxHeight = '297mm';
      element.style.height = '297mm';
      element.style.overflow = 'hidden';
    }

    const targetFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

    const opt = {
      margin: 0,
      filename: targetFilename,
      image: { type: 'png', quality: 1.0 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['section', 'h1', 'h2', 'h3'] }
    };

    await html2pdf().set(opt).from(element).save();
    toast.success('Resume downloaded successfully! 🎉', { id: toastId });
  } catch (err) {
    console.error('html2pdf export failed, fallback to print:', err);
    toast.error('PDF export failed. Opening print window...', { id: toastId });
    window.print();
  } finally {
    // Remove watermark if added
    if (watermarkEl && watermarkEl.parentNode) {
      watermarkEl.parentNode.removeChild(watermarkEl);
    }
    // Restore original inline styles
    element.classList.remove('exporting-pdf');
    element.style.transform = origTransform;
    element.style.boxShadow = origBoxShadow;
    element.style.marginBottom = origMarginBottom;
    element.style.position = origPosition;
    element.style.border = origBorder;
    element.style.maxHeight = origMaxHeight;
    element.style.height = origHeight;
    element.style.overflow = origOverflow;
  }
};
