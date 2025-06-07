// myClass.js
class MyClass {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, ${this.name}!`);
  }

  setName(newName) {
    this.name = newName;
  }

  getName() {
    return this.name;
  }
}

module.exports = MyClass;
