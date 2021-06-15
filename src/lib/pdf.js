import PdfPrinter from "pdfmake"

export const generatePDFStream = (profile, experiences) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  }

  const printer = new PdfPrinter(fonts)

  const expToPdf = experiences.map((exp) => {
    return [
      {
        text: `\n\n${exp.role}, ${exp.company}`,
        style: "job",
      },
      {
        ul: [
          {
            ul: [
              `from: ${exp.startDate} to: ${exp.endDate}`,
              `${exp.area}`,
              `${exp.description}`,
            ],
          },
        ],
      },
    ]
  })

  console.log(...expToPdf)

  var docDefinition = {
    content: [
      {
        text: `\n\n${profile.name} ${profile.surname} - CV`,
        style: "title",
      },
      { text: `\n\n${profile.title}`, style: "quote" },
      { text: `\n\n${profile.email}`, style: "small" },
      { text: "\n\nAbout me", style: "subheader" },
      {
        text: `\n\n${profile.bio}`,
        style: "bio",
      },
      { text: "\n\nWorking Experience", style: "listHeader" },
      //start of experiences
      expToPdf,
    ],
    styles: {
      title: {
        fontSize: 22,
        bold: true,
        margin: [0, 0, 0, -15],
      },
      subheader: {
        fontSize: 18,
        bold: true,
        margin: [0, 10, 0, -3],
      },
      listHeader: {
        fontSize: 18,
        bold: true,
        margin: [0, 10, 0, -3],
      },
      quote: {
        italics: true,
        margin: [0, 0, 0, -15],
      },
      small: {
        fontSize: 12,
        margin: [0, 0, 0, 30],
      },
      job: {
        fontSize: 13,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      bio: {
        margin: [0, 0, 0, 20],
      },
    },
  }

  const options = {
    // ...
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options)
  pdfReadableStream.end()

  return pdfReadableStream
}
