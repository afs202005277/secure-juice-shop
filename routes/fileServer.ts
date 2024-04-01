/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import path = require('path')
import { type Request, type Response, type NextFunction } from 'express'
import challengeUtils = require('../lib/challengeUtils')

import * as utils from '../lib/utils'

const security = require('../lib/insecurity')
const challenges = require('../data/datacache').challenges
const allowList = ['legal.md', 'incident-support.kdbx']

module.exports = function servePublicFiles () {
  return ({
    params,
    query
  }: Request, res: Response, next: NextFunction) => {
    const file = params.file

    if (!file.includes('/')) {
      verify(file, res, next)
    } else {
      res.status(403)
      next(new Error('File names cannot contain forward slashes!'))
    }
  }

  function verify (file: string, res: Response, next: NextFunction) {
    if (file && allowList.includes(file) && (endsWithAllowlistedFileType(file))) {
      file = security.cutOffPoisonNullByte(file)

      challengeUtils.solveIf(challenges.directoryListingChallenge, () => {
        return file.toLowerCase() === 'acquisitions.md'
      })
      verifySuccessfulPoisonNullByteExploit(file)

      res.sendFile(path.resolve('ftp/', file))
    } else {
      res.status(403)
      next(new Error('You are not authorized to access this file!'))
    }
  }

  function verifySuccessfulPoisonNullByteExploit (file: string) {
    challengeUtils.solveIf(challenges.easterEggLevelOneChallenge, () => {
      return file.toLowerCase() === 'eastere.gg'
    })
    challengeUtils.solveIf(challenges.forgottenDevBackupChallenge, () => {
      return file.toLowerCase() === 'package.json.bak'
    })
    challengeUtils.solveIf(challenges.forgottenBackupChallenge, () => {
      return file.toLowerCase() === 'coupons_2013.md.bak'
    })
    challengeUtils.solveIf(challenges.misplacedSignatureFileChallenge, () => {
      return file.toLowerCase() === 'suspicious_errors.yml'
    })

    challengeUtils.solveIf(challenges.nullByteChallenge, () => {
      return challenges.easterEggLevelOneChallenge.solved || challenges.forgottenDevBackupChallenge.solved || challenges.forgottenBackupChallenge.solved ||
                challenges.misplacedSignatureFileChallenge.solved || file.toLowerCase() === 'encrypt.pyc'
    })
  }

  function endsWithAllowlistedFileType (param: string) {
    return utils.endsWith(param, '.md') || utils.endsWith(param, '.pdf')
  }
}
