function generatePDF() {
  // Get the print layout URL
  const printURL = new URL("print", window.location.href).href;

  // Fetch the print layout content
  fetch(printURL)
    .then((response) => response.text())
    .then((html) => {
      // Create a temporary container
      const container = document.createElement("div");
      container.innerHTML = html;

      // Apply print styles inline (since CSS isn't loaded in the container)
      const printStyles = `
        body { font-size: 8pt; background-color: white; padding: 0; }
        .wrapper { max-width: 100%; }
        .sidebar-wrapper { position: static; }
        .main-wrapper .time { padding: 10px 30px 10px 10px; }
        .remove-container.container-block { display: none; }
        footer { display: none; }
        .skillset, .container-block { break-inside: avoid; }
        .skillset .level-bar-inner { background-color: #007bff !important; }  /* Use your theme color */
        .fa-inverse, .fa-inverse:after, .fa-inverse:before { color: #ffffff !important; }
        .print-button, .pdf-button, .d-print-none { display: none !important; }
        .item { break-inside: avoid; }
        .name { font-size: 16pt; }
        .tagline { font-size: 10pt; }
        .container-block-title { font-size: 10pt; }
        .degree { font-size: 8pt; }
      `;
      const style = document.createElement('style');
      style.textContent = printStyles;
      container.appendChild(style);

      // Get name from the DOM (as defined in data.yml)
      const name = document.querySelector(".name").textContent;
      // Format filename: replace spaces with underscores and append _resume.pdf
      const filename = `${name.replace(/\s+/g, "_")}_Resume.pdf`;

      // Configure pdf options (reduced scale to prevent upscaling)
      const opt = {
        margin: 10,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 1,  /* Changed from 2 to avoid enlarging fonts */
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      // Generate PDF
      html2pdf()
        .set(opt)
        .from(container)
        .save()
        .catch((err) => console.error("Error generating PDF:", err));
    });
}