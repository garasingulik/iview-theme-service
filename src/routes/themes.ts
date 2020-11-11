import * as express from 'express'
import * as iotsReporters from 'io-ts-reporters'

import * as T from '../lib/types'

import { generateTheme, initTheme, setThemeColor } from '../lib/themes'
import { authenticationMiddleware } from './authorization'

export const ThemesRoutes = {
  register: (app: express.Application) => {

    app.post('/themes/init/:name', authenticationMiddleware, async (req, res) => {
      const name = req.params.name || ''

      if (!name || name === '') {
        return res.status(400).json({
          errors: [
            'Theme name is required'
          ]
        })
      }

      const result = await T.wrapPromise(initTheme(name))
      if (T.isError(result)) {
        console.error(result)
        return res.status(500).json({ message: `Error when creating theme ${name}` })
      }

      console.log(result)
      return res.json({ message: `Theme ${name} is created` })
    })

    app.post('/themes/generate/:name', authenticationMiddleware, async (req, res) => {
      const name = req.params.name || ''

      if (!name || name === '') {
        return res.status(400).json({
          errors: [
            'Theme name is required'
          ]
        })
      }

      const result = await T.wrapPromise(generateTheme(name))
      if (T.isError(result)) {
        console.error(result)
        return res.status(500).json({ message: `Error when creating theme ${name}` })
      }

      console.log(result)
      return res.json({ message: `Theme ${name} is generated` })
    })

    app.put('/themes/colors/:name', authenticationMiddleware, async (req, res) => {
      const name = req.params.name || ''

      if (!name || name === '') {
        return res.status(400).json({
          errors: [
            'Theme name is required'
          ]
        })
      }

      const data = T.parseData<T.ThemeColorsRequestType>(req.body, T.ThemeColorsRequest)

      if (T.isParseError(data)) {
        return res.status(400).json({
          errors: iotsReporters.default.report(data)
        })
      }

      const result = await T.wrapPromise(setThemeColor(name, data))
      if (T.isError(result)) {
        console.error(result)
        return res.status(500).json({ message: `Error when creating theme ${name}` })
      }

      console.log(result)
      return res.json({ message: `Theme ${name} colors is updated` })
    })
  }
}
