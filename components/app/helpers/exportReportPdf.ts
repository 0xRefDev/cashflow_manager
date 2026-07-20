export async function exportElementToPdf(element: HTMLElement, filename: string) {
  const html2pdf = (await import("html2pdf.js")).default;

  const pageHeight = Math.ceil(element.getBoundingClientRect().height);

  const options = {
    filename,
    margin: 0,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: "#0A0A0A", useCORS: true },
    jsPDF: {
      unit: "px" as const,
      format: [780, pageHeight] as [number, number],
      orientation: "portrait" as const,
    },
    pagebreak: { mode: "avoid-all" as const },
  } as const;

  await html2pdf().set(options).from(element).save();
}
