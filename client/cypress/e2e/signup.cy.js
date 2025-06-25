describe("Sign Up", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
  it("successfully signs up a new user", () => {
    const unique = Date.now();
    const uniqueEmail = `test${unique}@example.com`;
    const uniqueUser = `testuser${unique}`;

    cy.visit("/landing");
    cy.contains("Create a new account", { timeout: 10000 }).click();

    cy.get('input[placeholder="Email"]').type(uniqueEmail);
    cy.get('input[placeholder="First Name"]').type("Test");
    cy.get('input[placeholder="Last Name"]').type("User");
    cy.get('input[placeholder="User Name"]').type(uniqueUser);
    cy.get('input[placeholder="Password"]').type("password123");

    cy.contains("button", "Agree and Join").click();

    // Assert that the user is redirected to the home page
    cy.url({ timeout: 10000 }).should("include", "/home");

    cy.contains("Registration successful!").should("be.visible");
  });
});
