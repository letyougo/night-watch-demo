/**
 * Created by xiaoxiaosu on 17/7/17.
 */

module.exports = {
    "todo-mvc":function (client) {


        client.url('http://todomvc.com/examples/vue/')
            .waitForElementPresent('body',100)

        //输入todos
        for(var i=0;i<5;i++){
            client.setValue('.header input.new-todo','hello '+i)
                .keys(client.Keys.ENTER)
                .pause(1000)
        }

        client
            .click('.todo-list .todo:nth-child(1) input[type=checkbox]').pause(500)
            .verify
            .cssClassPresent('.todo-list .todo:nth-child(1)','completed','点击第一项被标记上了已完成')
            .click('.todo-list .todo:nth-child(3) input[type=checkbox]').pause(500)
            .verify
            .cssClassPresent('.todo-list .todo:nth-child(3)','completed','点击第三项被标记上了已完成')
            .moveToElement('.todo-list .todo:nth-child(1)',10,10)
            .pause(3000)
            .click(".todo-list .todo:nth-child(1) button.destroy")


        for(var i=5;i<10;i++){
            client.setValue('.header input.new-todo','hello '+i)
                .keys(client.Keys.ENTER)
                .pause(1000)
        }

        client
            .click('.todo-list .todo:nth-child(4) input[type=checkbox]').pause(500)
            .click('.todo-list .todo:nth-child(7) input[type=checkbox]').pause(500)
            .click('.filters li:nth-child(3)')



        for(var i=0;i<3;i++){

            var text
            if(i==0){
                text = 'hello 2'
            }
            if(i==1){
                text = 'hello 4'
            }
            if(i==2){
                text = 'hello 7'
            }
            client
                .verify.cssClassPresent('.todo-list .todo:nth-child('+(i+1)+')','completed')
                .verify.containsText('.todo-list .todo:nth-child('+(i+1)+') .view label',text)

        }

        client
            .click('.filters li:nth-child(1)').pause(500)

        for(var i=0;i<9;i++){
            if(i==1 || i==3 || i==6){
                client
                    .verify.cssClassPresent('.todo-list .todo:nth-child('+(i+1)+')','completed')
                    .verify.containsText('.todo-list .todo:nth-child('+(i+1)+') .view label','hello '+(i+1))
            }else {
                client
                    .verify.cssClassNotPresent('.todo-list .todo:nth-child('+(i+1)+')','completed')
                    .verify.containsText('.todo-list .todo:nth-child('+(i+1)+') .view label','hello '+(i+1))
            }

        }


        client
            .click('.clear-completed').pause(500)
            .elements('css selector','.todo-list .todo',function (res) {

                client.verify.equal(res.value.length,6)
            })

        client.verify.equal(111,111)


    },
    // after:function (client, done) {
    //     client.end()
    //     done()
    // }
};