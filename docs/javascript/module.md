# 模块化

## 一、CommonJS & ES6

- CommonJS使用`require()`引入模块，ES6使用`import`导入模块
- CommonJS使用`exports`和`module.exports`导出变量或函数，ES6使用`export`导出变量、函数或模块

## 二、require() & import

- require()返回的是一个拷贝，import导入的是引用
- require()是一个同步函数，而import语句在静态分析阶段确认依赖关系，在合适的时机进行异步加载

### 三、export和export default区别

- `export`导出成员，导入时导入值需要放到`{}`里面
- `export default`只能有一个，导入时导入值不用放到`{}`里面
