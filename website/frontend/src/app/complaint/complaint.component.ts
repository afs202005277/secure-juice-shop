/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { environment } from '../../environments/environment'
import { ComplaintService } from '../Services/complaint.service'
import { UserService } from '../Services/user.service'
import { Component, ElementRef, type OnInit, ViewChild } from '@angular/core'
import { UntypedFormControl, Validators } from '@angular/forms'
import { FileUploader } from 'ng2-file-upload'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBomb } from '@fortawesome/free-solid-svg-icons'
import { FormSubmitService } from '../Services/form-submit.service'
import { TranslateService } from '@ngx-translate/core'

library.add(faBomb)

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.scss']
})
export class ComplaintComponent implements OnInit {
  public customerControl: UntypedFormControl = new UntypedFormControl({ value: '', disabled: true }, [])
  public messageControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.maxLength(160)])

  public userEmail: any = undefined
  public complaint: any = undefined
  public confirmation: any

  constructor (private readonly userService: UserService, private readonly complaintService: ComplaintService, private readonly formSubmitService: FormSubmitService, private readonly translate: TranslateService) { }

  ngOnInit () {
    this.initComplaint()
    this.formSubmitService.attachEnterKeyHandler('complaint-form', 'submitButton', () => { this.save() })
  }

  initComplaint () {
    this.userService.whoAmI().subscribe((user: any) => {
      this.complaint = {}
      this.complaint.UserId = user.id
      this.userEmail = user.email
      this.customerControl.setValue(this.userEmail)
    }, (err) => {
      this.complaint = undefined
      console.log(err)
    })
  }

  save () {
    this.saveComplaint()
  }

  saveComplaint () {
    this.complaint.message = this.messageControl.value
    this.complaintService.save(this.complaint).subscribe((savedComplaint: any) => {
      this.translate.get('CUSTOMER_SUPPORT_COMPLAINT_REPLY', { ref: savedComplaint.id }).subscribe((customerSupportReply) => {
        this.confirmation = customerSupportReply
      }, (translationId) => {
        this.confirmation = translationId
      })
      this.initComplaint()
      this.resetForm()
    }, (error) => error)
  }

  resetForm () {
    this.messageControl.setValue('')
    this.messageControl.markAsUntouched()
    this.messageControl.markAsPristine()
  }
}
