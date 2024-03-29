import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { DXCode, Reasons } from "./dxcode.model";
import { DxCodeService } from './dxcode.service';

class DxCodeCss {
  reasonClass = "";
  reasonIconClass = "";
  commentClass = "";
  commentIconClass = "";

  constructor(dxcode: DXCode) {
    if(dxcode.comment != "") {
      this.commentIconClass = "is-selected";
    }
    if(dxcode.reasonId != 0) {
      this.commentIconClass = "is-selected";
    }
  }
}

@Component({
  selector: "dxcodes",
  templateUrl: "./dxcodes.component.html",
  providers: [DxCodeService]
})
export class DXCodesComponent implements OnInit {
  @Input() claimId: string;
  dxcodes: Array<DXCode> = [];
  private addDxCodeForm: FormGroup;
  private _selectedDxId = -1;
  private _selectedDxCode = "";
  private _selectedDxDesc = "";
  private _selectedDxCodeDesc = "";
  private dxcodeCss: Array<DxCodeCss> = [];
  private reasons: Reasons[];
  private allowToAdd: boolean;

  constructor(
    private _dxcodeService: DxCodeService,
    private _fb: FormBuilder,
    private _toastr: ToastsManager) {
      this.addDxCodeForm = _fb.group({
        dxcode: ['', Validators.required],
        comment: ['']
      });
    this.allowToAdd = false;
  }

  private loadreasons() {
    this._dxcodeService.getReasons({"claimId": this.claimId})
        .then(res => {
          this.reasons = res;
        });
  }
  
  private loadDxCodes() {
    if (this.claimId == null) {
      this.dxcodes = [];
      this.dxcodeCss = [];
    } else{
      this._dxcodeService.getDxcodes({"claimId": this.claimId})
          .then(res => {
            this.dxcodes = res;
            var self = this;
            this.dxcodeCss = [];
            this.dxcodes.map( function(dxcode){
              self.dxcodeCss.push(new DxCodeCss(dxcode));
            }); 
          });
    }
  }

  private reloadDxCodes() {
    this.loadDxCodes();
    this.loadreasons();
  }

  ngOnInit(): void {
    this.reloadDxCodes();
  }

  resetForm() {
    this.addDxCodeForm.reset();
  }

  clicked(dxcode: DXCode, index: number) {
    // http://stackoverflow.com/questions/35054004/how-to-use-jquery-with-javascript-in-angular-2
    // http://www.code-sample.com/2016/07/use-jquery-with-angular-2.html
    // https://www.youtube.com/watch?v=vrdHEBkGAow
    // http://www.syntaxsuccess.com/viewarticle/using-jquery-with-angular-2.0
    // https://www.jamestease.co.uk/blether/add-remove-or-toggle-classes-using-vanilla-javascript
    if (this.dxcodeCss[index].commentClass == "") {
      this.dxcodeCss[index].commentClass  = "is-visible";
    } else {
      this.dxcodeCss[index].commentClass  = "";
    }
    // var _id = "#" + dxcode.id;
    // this.elementRef.nativeElement.querySelector(_id).textContent = "BAM!";
    // https://jsfiddle.net/4tuavhL2/
  }

  showMessage(index) {
    if (this.dxcodeCss[index].reasonClass == "") {
      this.dxcodeCss[index].reasonClass = "is-visible";
    } else {
      this.dxcodeCss[index].reasonClass = "";
    }
  }

  addDxCode() {
    if (this._selectedDxId < 0 || this._selectedDxCode == "" || this._selectedDxDesc == "" ||
        this._selectedDxCodeDesc == "" ||
        this._selectedDxCodeDesc != this.addDxCodeForm.controls['dxcode'].value) {
      this._selectedDxId = -1;
      this.addDxCodeForm.controls['dxcode'].setErrors({
        required: true
      })
    } else {
      var _comment = this.addDxCodeForm.controls["comment"].value;
      var dxCodeContent = {
        claimId: this.claimId,
        dxCode: { 
          id: this._selectedDxId
        },
        comment: _comment == null ? "" : _comment,
        invalid: false
      };
      this._dxcodeService.addDxCode(dxCodeContent)
          .then(res => {
            if (res.flag) {
              this._toastr.success("DxCode added successfully.");
              this.addDxCodeForm.reset();
              this.reloadDxCodes();
            } else {
              this._toastr.error("There was a problem adding DxCode");
              this.addDxCodeForm.reset();
            }
            this.allowToAdd = false;
          });
      }
    }
  
  registerInvalid(dxcode: DXCode) {
    var dxCodeContent = {
      invalid: !dxcode.invalid,
      id: dxcode.id,
      claimId: this.claimId};
    this._dxcodeService.postDxCodeReview(dxCodeContent)
        .then(res => {
          if (res.flag) {
            this._toastr.success("Dxcode " + (dxcode.invalid ? "invalid unregistered." : "invalid registered."));
            this.reloadDxCodes();
          }
        });
  }

  private _sendComment(event, dxcode: DXCode, index) {
    event.stopPropagation();
    this.dxcodeCss[index].commentClass = "";
    var dxCodeContent = {
      comment: dxcode.comment,
      id: dxcode.id,
      claimId: this.claimId
    }
    this._dxcodeService.postDxCodeComment(dxCodeContent)
        .then(res => {
          if (res.flag) {
            this._toastr.success("Comment submitted.")
            this.loadDxCodes();
          }
    });
  }

  onKey(event, dxcode: DXCode, index) {
    if (event.key == "Enter"){
      this._sendComment(event, dxcode, index);
    }
  }

  sendComment(event, dxcode: DXCode, index) {
    this._sendComment(event, dxcode, index);
  }

  private checkForDuplicate(_dxCode): boolean {
    for (let element of this.dxcodes) {
      if (element.dxCode.dxCode == _dxCode) {
        return true;
      }
    }
    return false;
  }

  searchDxCodeDesc(event) {
    var self = this;
    event.stopPropagation();
    var DXCODE_SEARCH_URL = localStorage.getItem('baseUrl') + '/search/dxcode/';
    var DXDESC_SEARCH_URL = localStorage.getItem('baseUrl') + '/search/dxdesc/';
    (<any>$('.ui.search.dxcode'))
            .search({
                apiSettings: {
                    url: DXCODE_SEARCH_URL,
                    method: 'POST',
                    beforeXHR: function(xhr) {
                      xhr.setRequestHeader('Content-type', 'application/json');
                      return xhr;
                    },
                    beforeSend: (settings) => {
                      settings.data = JSON.stringify({query: event.target.value});
                      return settings
                    }
                },
                fields: {
                    results : 'dxCodeList',
                    title   : 'dxCode',
                    description: 'dxDesc'
                },
                onSelect: function(result, response) {
                  if (self.checkForDuplicate(result.dxCode)) {
                    self._toastr.error("Duplicate DxCode selected.");
                    self.addDxCodeForm.patchValue({dxcode: ""});
                    self.addDxCodeForm.patchValue({comment: ""});
                    self.allowToAdd = false;
                  } else {
                    self.addDxCodeForm.patchValue({dxcode: result.dxCombined});
                    self._selectedDxId = result.id;
                    self._selectedDxCode = result.dxCode;
                    self._selectedDxDesc = result.dxDesc;
                    self._selectedDxCodeDesc = result.dxCombined;
                    self.allowToAdd = true;
                  }
                  return false;
                },
                minCharacters : 2
            });
  }

  private setReason(event, reasonId, dxcode:DXCode) {
    event.stopPropagation();
    var dxCodeContent = {
      id: dxcode.id,
      reasonId: reasonId
    }
    this._dxcodeService.postReason(dxCodeContent)
        .then(res => {
          if (res.flag) {
            this.reloadDxCodes();
            this._toastr.success("DxCode has been registered as invalid.");
          } else {
            this._toastr.error("Error while registering invalid DxCode.");
          }
        });
  }

  private makeItValid(event, dxcode: DXCode) {
    event.stopPropagation();
    var dxCodeContent = {
      id: dxcode.id
    };
    this._dxcodeService.postValid(dxCodeContent)
        .then(res => {
          if (res.flag) {
            this.reloadDxCodes();
            this._toastr.success("DxCode has been registered as valid.");
          } else {
            this._toastr.error("Error while registering valid DxCode.");
          }
        });
  }
}
