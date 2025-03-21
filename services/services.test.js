const queries = require('./services')

test("Add new service in the database", ()=>{
    expect(queries.createService("asdf","asdf","asdf").then().toBe("has been saved successfully"))
})