const fs = require('fs');
const data =require('./data.json');
const { age, date } = require('./utils');

//  show =================================
exports.show = function(req, res) {
    // req.query.id
    // req.body
    // req.params.id = /:id
    const { id } = req.params;

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id;
    })

    if (!foundInstructor) return res.send("Instructor not found!");

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at),
    }

    return res.render("instructors/show", { instructor: instructor });
}

// create  ================================
exports.post = function(req, res) {
    //req.body -> envia todas os nomes das chaves com seus respectivos valores
    //const keys = Object.keys(req.body) -> envia apenas o nome das chaves
    keys = Object.keys(req.body);

    for(key of keys){
        // req.body.key == ""
        if (req.body[key] == ''){
            return res.send('Por favor, preencha todos os campos.');
        }
    }
    
    let {avatar_url, birth, gender, services, name} = req.body;

    birth = Date.parse(birth);
    const created_at = Date.now();
    const id = Number(data.instructors.length + 1);

    // array vazio []
    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    }) // array com objeto [{...}]

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Write file error!");
        return res.redirect("/instructors");
    });

    // return res.send(req.body)
}

// edit ===================================
exports.edit = function(req, res) {
    const { id } = req.params;

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    });

    if (!foundInstructor) return res.send("Instructor not found!");

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth)
    }

    return res.render('instructors/edit', { instructor });
}
