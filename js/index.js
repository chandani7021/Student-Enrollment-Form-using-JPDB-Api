var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var stuDBName = 'SCHOOL-DB';
var StuRelationName = 'STUDENT-TABLE'
var connToken = '90938170|-31949270485171257|90955054'

$('#studentid').focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getStudentIdAsJsonObj(){
    var studentid = $('#studentid').val();
    var jsonStr = {
        id:studentid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#studentname').val(record.name);
    $('#studentclass').val(record.class);
    $('#studentbirth').val(record.birthdate);
    $('#studentaddress').val(record.address);
    $('#studentenroll').val(record.EnrollDate);
}


function resetForm(){
    $('#studentid').val("");
    $('#studentname').val("");
    $('#studentclass').val("");
    $('#studentbirth').val("");
    $('#studentaddress').val("");
    $('#studentenroll').val("");

    $('#studentid').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#update').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#studentid').focus();
}

function validateData(){
    var studentid, studentname, studentclass, studentbirth, studentaddress, studentenroll;
    studentid = $('#studentid').val();
    studentname = $('#studentname').val();
    studentclass =  $('#studentclass').val();
    studentbirth = $('#studentbirth').val();
    studentaddress =  $('#studentaddress').val();
    studentenroll = $('#studentenroll').val();

    if (studentid === '') {
        alert('Student Roll no is required');
        $('#studentid').focus();
        return "";
    }

    if (studentname === '') {
        alert('Student Name is required');
        $('#studentname').focus();
        return "";
    }

    if (studentclass === '') {
        alert('Student class is required');
        $('#studentclass').focus();
        return "";
    }

    if (studentbirth === '') {
        alert('Student Birth Date is required');
        $('#studentbirth').focus();
        return "";
    }

    if (studentaddress === '') {
        alert('Student address is required');
        $('#studentaddress').focus();
        return "";
    }

    if (studentenroll === '') {
        alert('Student Enrollment Date is required');
        $('#studentenroll').focus();
        return "";
    }

    var jsonStrObj = {
        id : studentid,
        name: studentname,
        class: studentclass,
        birthdate: studentbirth,
        address: studentaddress,
        EnrollDate: studentenroll
    };
    return JSON.stringify(jsonStrObj);

}

function getStudent(){
    var stuIdJsonObj = getStudentIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, StuRelationName, stuIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBAseUrl(getRequest, jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async: true});

    if(resJsonObj.status === 400) {
        $('#save').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#studentname').focus();
    } 
    else if (resJsonObj.status === 200) {
        
        $('#studentid').prop("disabled", true);
        fillData(resJsonObj);

        $('#update').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#studentname').focus();
    }
}


function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ''){
        return "";
    }

    var putRequest = createPUTRequest(connToken , jsonStrObj, stuDBName, StuRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBAseUrl(putRequest, jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#studentid').focus();
}

function updateData() {
    $('#update').prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, StuRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBAseUrl(updateRequest, jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#studentid').focus();
}