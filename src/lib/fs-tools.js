import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const authorsImgFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/authors"
)
const coverImgFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/postCover"
)

export const getAuthors = async () =>
  await readJSON(join(dataFolderPath, "authors.json"))
export const getPosts = async () =>
  await readJSON(join(dataFolderPath, "blogPosts.json"))

export const writeAuthors = async (content) =>
  await writeJSON(join(dataFolderPath, "authors.json"), content)
export const writePosts = async (content) =>
  await writeJSON(join(dataFolderPath, "blogPosts.json"), content)

export const getCurrentFolderPath = (currentFile) =>
  dirname(fileURLToPath(currentFile))

export const writeAuthorImg = async (fileName, content) =>
  await writeFile(join(authorsImgFolderPath, fileName), content)

export const writePostCover = async (fileName, content) =>
  await writeFile(join(coverImgFolderPath, fileName), content)
