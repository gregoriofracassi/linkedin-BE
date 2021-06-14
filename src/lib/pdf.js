import PdfPrinter from "pdfmake"

export const generatePDFStream = (data) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  }

  const printer = new PdfPrinter(fonts)

  const docDefinition = {
    header: `${data.title} by ${data.author.name}`,

    footer: {
      columns: ["Left part", { text: "Right part", alignment: "right" }],
    },

    content: [data.content],
  }

  const options = {
    // ...
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options)
  pdfReadableStream.end()

  return pdfReadableStream
}
