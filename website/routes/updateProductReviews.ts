/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import challengeUtils = require('../lib/challengeUtils')
import { type Request, type Response, type NextFunction } from 'express'

const challenges = require('../data/datacache').challenges
const db = require('../data/mongodb')
const security = require('../lib/insecurity')

function containsOnlyAlphanumeric (value: string): boolean {
  // Regular expression to match alphanumeric characters
  const alphanumericRegex = /^[a-zA-Z0-9]+$/
  return alphanumericRegex.test(value)
}

// vuln-code-snippet start noSqlReviewsChallenge forgedReviewChallenge
module.exports = function productReviews () {
  return (req: { body: { id: any, message: any } }, res: {
    status: (arg0: number) => { (): any, new(): any, json: { (arg0: { message: string }): void, new(): any } }
    json: (arg0: any) => void
  }, next: any) => {
    const user = security.authenticatedUsers.from(req)
    // Validate and sanitize input data
    const reviewId = req.body.id
    const newMessage = req.body.message
    console.log(reviewId)
    // Check if user is authenticated
    if (!user || !containsOnlyAlphanumeric(reviewId.toString())) {
      res.status(401).json({ message: 'Unauthorized' })
      return // Return to prevent further execution
    }

    // Check if user is authorized to update the review
    db.reviews.findOne({
      _id: reviewId,
      author: user.data.email
    })
      .then((existingReview: any) => {
        console.log(existingReview)
        if (!existingReview) {
          res.status(403).json({ message: 'Forbidden' })
          return // Return to prevent further execution
        }

        // Update review message
        db.reviews.update(
          { _id: existingReview._id },
          { $set: { message: newMessage } },
          { multi: true }
        ).then(
          (result: any) => {
            res.json(result)
          },
          (err: any) => {
            console.error(err)
            res.status(500).json({ message: 'Internal Server Error' }) // Send error response here
          }
        )
      })
  }
}
// vuln-code-snippet end noSqlReviewsChallenge forgedReviewChallenge
