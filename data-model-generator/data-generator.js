const processNameText = "Expense";
const subTypeArray= ["Airfare", "Mobile", "CarRental", "Food"];
const creatorLevel = ["Employee" , "Manager"];
const assignees = [
  {
    title:"Manager",
    jobLevel:1,
    approvalLimit:5000
  },
  {
    title:"Senior Manager",
    jobLevel:2,
    approvalLimit:10000
  },
  {
    title:"Director",
    jobLevel:3,
    approvalLimit:20000
  },
  {
    title:"Senior Director",
    jobLevel:4,
    approvalLimit:30000
  },
  {
    title:"Vice President",
    jobLevel:5,
    approvalLimit:50000
  },
  {
    title:"SVP",
    jobLevel:6,
    approvalLimit:100000
  },
  {
    title:"EVP",
    jobLevel:7,
    approvalLimit:150000
  },
  {
    title:"CEO",
    jobLevel:8,
    approvalLimit:500000
  },
];
const minAmount =100;
const receiptValidityArray = ["TRUE", "FALSE"];
const hasAttachmentArray = ["TRUE", "FALSE"];
const outcomeArray=["APPROVE", "REJECT"];

/**
 * Method to get the random value from the given collection
 * params : collection : [] Array
 * return: string
 */
const getRandomValue = (collection) => {
  const randomElement = collection[Math.floor( Math.random() * collection.length)];
  return randomElement;
};

/**
 * Method to get the random amount within the provided limit
 * params : approvalLimit: Integer, min: Integer
 * return: Integer
 */
const getAmountWithinLimit = (approvalLimit, min) => {
  return Math.floor(Math.random() * (approvalLimit - min + 1) ) + min
};

/**
 * Method to get the random amount greater thanthe provided limit
 * params : approvalLimit: Integer
 * return: Integer
 */

const getAmountOutsideLimit = (approvalLimit) => {
  return Math.floor(Math.random() * approvalLimit)+approvalLimit
};

/**
 * Method to generate data set based on the provided conditions 
 * params : conditions: {} Object
 * return: Array
 */
const buildAllCasesDataSet = (conditions) => {
  const {amountTobeInLimit, daysDifferenceinLimit, isAttachementAttached, dataSetNumber = 10} = conditions
  const allCasesDataSet = [];
  for(i=0;i<dataSetNumber;i++){
    const getRandomAssignee = getRandomValue(assignees);
    const {
      approvalLimit,
      jobLevel
    } = getRandomAssignee;
    const shouldApprove = amountTobeInLimit && daysDifferenceinLimit && isAttachementAttached;

    const dataObj = {
      processName: processNameText,
      subtype: getRandomValue(subTypeArray),
      creatorLevel: getRandomValue(creatorLevel),
      jobLevel,
      amount: amountTobeInLimit ? getAmountWithinLimit(approvalLimit, minAmount) : getAmountOutsideLimit(approvalLimit),
      isValidReceipt:daysDifferenceinLimit ? receiptValidityArray[0] :receiptValidityArray[1],
      hasAttachment:isAttachementAttached ? hasAttachmentArray[0] : hasAttachmentArray[1],
      outcome:shouldApprove ? outcomeArray[0] : outcomeArray[1]
    }
    allCasesDataSet.push(dataObj);
  }
  return allCasesDataSet;
};

/**
 * Method to convert the given Array into CSV format
 * params : dataArray: [] Array
 * return: String
 */
const convertToCSV = (dataArray) => {
  const dataSet = typeof dataArray != 'object' ? JSON.parse(dataArray) : dataArray;
  let completeDataString = '';
  let columnLine = '';

  const head = dataSet[0];
  for (let key in dataSet[0]) {
    columnLine += key + ',';
  }
  columnLine = columnLine.slice(0, -1);
  completeDataString += columnLine + '\r\n';

  for (var i = 0; i < dataSet.length; i++) {
    var dataLine = '';
    for (let key in dataSet[i]) {
      dataLine += dataSet[i][key] + ',';
    }
    dataLine = dataLine.slice(0, -1);
    completeDataString += dataLine + '\r\n';
  }
  console.log(completeDataString);
  return completeDataString
};

/**
 * Method which gets invoked by CTA to generateDataSet, invokes buildAllCasesDataSet func internally , 
 * based on the given condtions.
 * Once the dataSet is generated , adds it to the textarea input.
 */
const createDataSet = () => {
  const allCasesDataSet = [
  ...buildAllCasesDataSet({amountTobeInLimit:true, daysDifferenceinLimit:true, isAttachementAttached:true, dataSetNumber:1000}),
    ...buildAllCasesDataSet({amountTobeInLimit:true, daysDifferenceinLimit:true, isAttachementAttached:false, dataSetNumber:50}),
    ...buildAllCasesDataSet({amountTobeInLimit:true, daysDifferenceinLimit:false, isAttachementAttached:true, dataSetNumber:50}),
    ...buildAllCasesDataSet({amountTobeInLimit:true, daysDifferenceinLimit:false, isAttachementAttached:false, dataSetNumber:50}),
    ...buildAllCasesDataSet({amountTobeInLimit:false, daysDifferenceinLimit:true, isAttachementAttached:true, dataSetNumber:50}),
    ...buildAllCasesDataSet({amountTobeInLimit:false, daysDifferenceinLimit:false, isAttachementAttached:true, dataSetNumber:50}),
    ...buildAllCasesDataSet({amountTobeInLimit:false, daysDifferenceinLimit:true, isAttachementAttached:false, dataSetNumber:50}),
    ...buildAllCasesDataSet({amountTobeInLimit:false, daysDifferenceinLimit:false, isAttachementAttached:false, dataSetNumber:50}),
  ]
  
  const csvData= convertToCSV(allCasesDataSet);
  document.getElementById("data-box").value = csvData;
}