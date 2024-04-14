/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response } from 'express'
import { ChallengeModel } from '../models/challenge'
import AES from 'crypto-js/aes'

const sequelize = require('sequelize')
const challenges = require('../data/datacache').challenges
const Op = sequelize.Op

const secretKey = '34aW;HMyP)"jH04kL4Np1ZQ8q1&X0K'

module.exports.continueCode = function continueCode () {
  return (req: Request, res: Response) => {
    const ids = []
    for (const name in challenges) {
      if (Object.prototype.hasOwnProperty.call(challenges, name)) {
        if (challenges[name].solved) ids.push(challenges[name].id)
      }
    }
    const continueCode = ids.length > 0 ? AES.encrypt(ids.toString(), secretKey).toString() : undefined
    res.json({ continueCode })
  }
}

module.exports.continueCodeFindIt = function continueCodeFindIt () {
  return async (req: Request, res: Response) => {
    const ids = []
    const challenges = await ChallengeModel.findAll({ where: { codingChallengeStatus: { [Op.gte]: 1 } } })
    for (const challenge of challenges) {
      ids.push(challenge.id)
    }
    const continueCode = ids.length > 0 ? AES.encrypt(ids.toString(), secretKey).toString() : undefined
    res.json({ continueCode })
  }
}

module.exports.continueCodeFixIt = function continueCodeFixIt () {
  return async (req: Request, res: Response) => {
    const ids = []
    const challenges = await ChallengeModel.findAll({ where: { codingChallengeStatus: { [Op.gte]: 2 } } })
    for (const challenge of challenges) {
      ids.push(challenge.id)
    }
    const continueCode = ids.length > 0 ? AES.encrypt(ids.toString(), secretKey).toString() : undefined
    res.json({ continueCode })
  }
}
