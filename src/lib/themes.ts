import * as fs from 'fs'
import * as childProcess from 'child_process'

import * as T from './types'

export const initTheme = (name: string): T.R<string> => {
  return new Promise((resolve, reject) => {
    const cmd = `THEME_DIR=./public/themes/${name} npm run theme:init`
    childProcess.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }
      if (stderr) {
        console.log('STDERR: ', stderr)
      }
      return resolve(stdout)
    })
  })
}

export const generateTheme = (name: string): T.R<string> => {
  return new Promise((resolve, reject) => {
    const cmd = `THEME_DIR=./public/themes/${name} npm run theme:build`
    childProcess.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }
      if (stderr) {
        console.log('STDERR: ', stderr)
      }
      return resolve(stdout)
    })
  })
}

export const setThemeColor = (name: string, themeColors: T.ThemeColorsRequestType): T.R<string> => {
  return new Promise((resolve, reject) => {
    const customCssFile = `./public/themes/${name}/custom.less`
    fs.readFile(customCssFile, 'utf8', function (error, data) {
      if (error) {
        return reject(error)
      }
      // color replacement
      const result = data.replace(/^@primary-color.*;$/gm, `@primary-color : ${themeColors.primaryColor};`)
      fs.writeFile(customCssFile, result, 'utf8', function (error) {
        if (error) {
          return reject(error)
        }
        return resolve()
      })
    })
  })
}