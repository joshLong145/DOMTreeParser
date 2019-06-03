'use strict';

const fs = require('fs');

var Node = (function() {
    function Node(tag) {
        this.tag = tag;
        this.children = [];
    };

    Object.defineProperty(Node.prototype, 'Children', {
        get: function () {
            this.children;
        },
        enumerable: true,
        configurable: true
    });

    Node.prototype.addChild = function(node) {
        this.children.push(node);
    };


    return Node;
}());

var Generator = (function() {
    function Generator() {};

    Generator.prototype.buildTraverse = function(buffer, node) {
        for(let i = 0; i < buffer.length; i++) {
            let startIndex = -1;
            let tagName = undefined;
            if(buffer[i] === "<" ) {
                startIndex = i;
                tagName = buffer.substr(startIndex + 2, buffer.indexOf(' ') - 1).trim();

            }
            if(i < buffer.length - 2 && 
                buffer[i] == '<' && 
                buffer[i + 1] == '/') {
                let tmpDataCache = buffer.substr(i + 2, buffer.length);
                let endTagName = buffer.substr(i + 2, tmpDataCache.indexOf('>')).trim();

                if (tagName.includes(endTagName)) {
                    const newNode = new Node(tagName);
                    node.addChild(newNode);
    
                    const chunk = buffer.substr(startIndex + 2, i + 2);
                    
                    Generator.prototype.buildTraverse(chunk, newNode);
                }
            } 
        }
    };

    Generator.prototype.levelsTraverse = function (node, level) {
        level ++
        for (let i = 0; i < node['children'].length; i ++) {
            Generator.prototype.levelsTraverse(node['children'][i], level);
        }

        return level;
    };

    return Generator;
}());

var Parser = (function() {
    function Parser(data) {
        this.data = data;
        this.root = new Node('ROOT');
        this.generator = new Generator(root);
    };

    Parser.prototype.statTraversal = function() {
        for(let i = 0; i < this.data.length; i++) {
            let startIndex = -1;
            let tagName = undefined;
            if(this.data[i] === "<") {
                this.startIndex = i;
                tagName = this.data.substr(startIndex + 2, this.data.indexOf(' ') - 1);
            }
            if(i < this.data.length - 2 && 
                this.data[i] === '<' && 
                this.data[i + 1] == '/') {
                let tmpDataCache = this.data.substr(i + 2, this.data.length);
                let endTagName = this.data.substr(i + 2, tmpDataCache.indexOf('>') );

                if (endTagName === tagName) {
                    const newNode = new Node(tagName);
                    this.root.addChild(newNode);
    
                    const chunk = this.data.substr(startIndex + 2, i + 2);
                    
                    this.generator.buildTraverse(chunk, newNode);
                }
            } 
        }
    };

    Parser.prototype.findNumberOfLevels = function() {
        let level = 1
        for (let i = 0; i < this.root['children'].length; i ++) {
            level += this.generator.levelsTraverse(this.root['children'][i], level);
        }

        return level;
    };

    return Parser;
}());


let main = function() { 
    const data = fs.readFileSync('/Users/jlong/Documents/app.component.html');
    const buffer = data.toString().replace(/\r?\n|\r/g, " ");
    const parser = new Parser(buffer);
    parser.statTraversal();
    const depth = parser.findNumberOfLevels(1);
    depth > 6 ? console.log('\x1b[41m', 'DEPTH: ',  depth) : console.log('\x1b[42m', 'DEPTH: ',  depth);

    
}



main();