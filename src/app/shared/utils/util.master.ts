/****************************   
 *                          *
 *          Del Sur         *
 *      Master Library      *
 *                          *
 *        Typescript        *
 *           v1.0           *
 *                          *
 ****************************/

/**
 * Email validation
 * True == valid
 */
export function validateEmail(email:string) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if ( regex.test(email) ){
        return true
    } else {
        return false
    }
}
/** 
 * Email domain validation
 * True == invalid
 */
export function validateEmailDomain(email:string){
    let forbibbenDomain = ['@yopmail.com','@seba.cl']
    let valid=false;
    forbibbenDomain.forEach(
        (dom) =>
            {
                if (email.indexOf(dom) >= 0){
                    valid = true
                }
            }
        )
    return valid
}

/**
 * Hour format validation
 * Format: HH:MM [00:00-23:59]
 */
export function validateHourFormat(hour:string){
    let regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if( regex.test(hour) ) {
        return true
    } else {
        return false
    }
}

/**
 * Date format validation
 * Format: YYYY-MM-DD
 */
export function validateDateFormat(date:string){
    let regex = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
    if( regex.test(date) ) {
        return true
    } else {
        return false
    }
}

/**
 * Date format validation
 * Format: DD/MM/YYYY
 */
export function validateDateFormatSlash(date:string){
    let regex = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
    if( regex.test(date) ) {
        return true
    } else {
        return false
    }
}

/**
 * Date format converter
 * Format: YYYY-MM-DD to DD/MM/YYYY or viceversa
 * Params: inverted == true -> YYYY-MM-DD to DD/MM/YYYY
 */
export function dateFormatCoverter(date:string, inverted?:boolean){
    
}



