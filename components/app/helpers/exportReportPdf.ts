export async function exportElementToPdf(element: HTMLElement, filename: string) {
  const html2pdf = (await import("html2pdf.js")).default;

  const pageHeight = Math.ceil(element.getBoundingClientRect().height);

  await html2pdf()
    .set({
      filename,
      margin: 0,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: "#0A0A0A", useCORS: true },
      jsPDF: { unit: "px", format: [780, pageHeight], orientation: "portrait" },
      pagebreak: { mode: "avoid-all" },
    })
    .from(element)
    .save();
}
