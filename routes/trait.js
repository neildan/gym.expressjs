/**
 * Success Response
 * @param Object data
 * @param String msj
 */
const success = (data, msj, code = null) => {
    return {
        state: true,
        msj: msj,
        data: data,
        code: code
    }
}

/**
 * Error Response
 * @param Object data
 * @param String msj
 */
const error = (data, msj, code = null) => {
    return {
        state: false,
        msj: msj,
        data: data,
        code: code
    }
}

module.exports = {
    success: success,
    error: error
}