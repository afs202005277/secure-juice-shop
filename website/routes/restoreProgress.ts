/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response } from 'express'
import AES from 'crypto-js/aes'
import CryptoJS from 'crypto-js'

const challenges = require('../data/datacache').challenges
const challengeUtils = require('../lib/challengeUtils')

const secretKey = '34aW;HMyP)"jH04kL4Np1ZQ8q1&X0K'

module.exports.restoreProgress = function restoreProgress () {
  return ({ params }: Request, res: Response) => {
    const continueCode = params.continueCode
    const decryptedData = AES.decrypt(continueCode, secretKey)
    const decryptedString = decryptedData.toString(CryptoJS.enc.Utf8);
    const ids = decryptedString.split(',').map(Number);
    if (challengeUtils.notSolved(challenges.continueCodeChallenge) && ids.includes(999)) {
      challengeUtils.solve(challenges.continueCodeChallenge)
      res.end()
    } else if (ids.length > 0) {
      for (const name in challenges) {
        if (Object.prototype.hasOwnProperty.call(challenges, name)) {
          if (ids.includes(challenges[name].id)) {
            challengeUtils.solve(challenges[name], true)
          }
        }
      }
      res.json({ data: ids.length + ' solved challenges have been restored.' })
    } else {
      res.status(404).send('Invalid continue code.')
    }
  }
}

module.exports.restoreProgressFindIt = function restoreProgressFindIt () {
  return async ({ params }: Request, res: Response) => {
  
    const continueCodeFindIt = params.continueCode
    const decryptedData = AES.decrypt(continueCodeFindIt, secretKey)
    const decryptedString = decryptedData.toString(CryptoJS.enc.Utf8);
    const idsFindIt = decryptedString.split(',').map(Number);
    if (idsFindIt.length > 0) {
      for (const key in challenges) {
        if (Object.prototype.hasOwnProperty.call(challenges, key)) {
          if (idsFindIt.includes(challenges[key].id)) {
            await challengeUtils.solveFindIt(key, true)
          }
        }
      }
      res.json({ data: idsFindIt.length + ' solved challenges have been restored.' })
    } else {
      res.status(404).send('Invalid continue code.')
    }
  }
}

module.exports.restoreProgressFixIt = function restoreProgressFixIt () {
  return async ({ params }: Request, res: Response) => {
    const continueCodeFixIt = params.continueCode
    const decryptedData = AES.decrypt(continueCodeFixIt, secretKey)
    const decryptedString = decryptedData.toString(CryptoJS.enc.Utf8);
    const idsFixIt = decryptedString.split(',').map(Number);
    if (idsFixIt.length > 0) {
      for (const key in challenges) {
        if (Object.prototype.hasOwnProperty.call(challenges, key)) {
          if (idsFixIt.includes(challenges[key].id)) {
            await challengeUtils.solveFixIt(key, true)
          }
        }
      }
      res.json({ data: idsFixIt.length + ' solved challenges have been restored.' })
    } else {
      res.status(404).send('Invalid continue code.')
    }
  }
}
