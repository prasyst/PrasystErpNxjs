'use client'
export const getFormMode = () => ({
    add: "ADD",
    edit: "EDIT",
    read: "READ",
  })

export const errorFormatter = (errors) => {
    let error = {};
    errors.forEach(err => {
        error[err.path[0]] = err.message
    })
    return error
}