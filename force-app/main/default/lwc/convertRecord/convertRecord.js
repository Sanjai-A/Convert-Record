import { LightningElement, wire ,track ,api} from "lwc";
import getObjects from '@salesforce/apex/FieldExplorerController.getObjects';
import getFields from '@salesforce/apex/FieldExplorerController.getFields';
import convert from '@salesforce/apex/ConvertObjectDetails.convert';
import { NavigationMixin } from 'lightning/navigation';
import modal from "@salesforce/resourceUrl/customModalPopupCSS";
import { CloseActionScreenEvent } from "lightning/actions";
import { loadStyle } from "lightning/platformResourceLoader";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class QuickActionLWC extends LightningElement {
    @api recordId;
    @api objectApiName;
    
  connectedCallback() {
    loadStyle(this, modal);
  }
  closeAction() {
    this.dispatchEvent(new CloseActionScreenEvent());
  }
  convertAction(){
    convert({ objectName: this.selectedOption,fieldsName:this.selectedVal,
              currentObject:this.objectApiName,currentRecordid:this.recordId})
        .then(result => {
            this.record = result; 
            console.log("Result From apex after record creation and recordId "+this.record);
            const evt = new ShowToastEvent({
                title: "Success",
                message: "Record Converted Successfully",
                variant: "success",
            });
            this.dispatchEvent(evt);
            this.dispatchEvent(new CloseActionScreenEvent());

        })
        .catch(error => {
            this.error = error;
            console.log("Error Message-"+ this.error)
            const event = new ShowToastEvent({
                title: 'Error',
                message: error.body.message,
                variant: 'error'
            });
            this.dispatchEvent(event);
            // if ( error.body.message =='REQUIRED_FIELD_MISSING'){
            // console.log("Required field Missing Error");
            // }
        });
  }


  
  @track objects = [];
  @track fields = [];
  @wire(getObjects)
  wiredMethod({ error, data }) {
      if (data) {
          this.dataArray = data;
          let tempArray = [];
          this.dataArray.forEach(function (element) {
              var option=
              {
                  label:element,
                  value:element
              };
              tempArray.push(option);
          });
          this.objects=tempArray;
      } else if (error) {
          this.error = error;
      }
  } 
  selectedOption='';
  handleObjectChange(event)
  {   
      //const selectedOption = event.detail.value; 
       this.selectedOption=event.detail.value;
      
      getFields({ objectName: this.selectedOption})
      .then(result => {
          this.dataArray = result;
          let tempArray = [];
          this.dataArray.forEach(function (element) {
              var option=
              {
                  label:element.Label,
                  value:element.Name
              };
              tempArray.push(option);
          });
          this.fields=tempArray;
          this.fieldsSelected();
        
      })
      .catch(error => {
          this.error = error;
      });
      
  }
  selectedVal = [];
  handleFieldChange(event){
    this.selectedVal = event.detail.value;
    this.objectSelected();
   console.log("Selected Fields-"+ this.selectedVal)
  
  }
  progress = 0;
  objectSelected() {
        var numVal = 0;

       
        if (this.selectedVal != null) {
            numVal = 1;
        }

        this.progressBar(numVal);
    }
    fieldsSelected() {
        var numVal1 = 0;
        
        if (this.selectedOption != null) {
            numVal1 = 2;
        }

        this.progressBar1(numVal1);
    }
    progressBar(numVal) {
        if (numVal == 1) {
            this.progress = numVal * 100;
        }
        else {
            this.progress = 0;
        }
    }
    progressBar1(numVal1) {
       
        if (numVal1 == 2) {   
            this.progress = numVal1 * 25;
        }
        else {
            this.progress = 0;
        }
    }
    
}