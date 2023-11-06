var appointment = require("../models/Appointment")
var mongoose = require("mongoose")
var AppointmentFactory = require("../factories/AppointmentFactory");
var nodemailer = require("nodemailer")

const Appo = mongoose.model("Appointment",appointment)

class AppointmentService{

    async Create(name, email, description, cpf, date, time){

        var newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        })
        try{ 

            await newAppo.save()
            return true;
        }catch(err){
            console.log(err);
            return false;
        }

    }


    async GetAll(showFinished){
        if(showFinished){
           return await Appo.find()
        }else{
            var appos = await Appo.find({'finished': false});
            var appointments =[];

            appos.forEach(appointment =>{

                if(appointment.date != undefined){

                    appointments.push(AppointmentFactory.Build(appointment))
                }

            })
            return appointments;
        }

    }

    async GetById(id){

        try{
            var event = Appo.findOne({'_id':id})
            return event;
        }catch(err){
            console.log(err);
        }
    }

    async Finish(id){
        try{
            await Appo.findByIdAndUpdate(id,{finished: true});
             return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }


    async Search(query){
        try{
            var appos = await Appo.find().or([{email: query},{cpf: query}]);
            return appos;
        }catch(err){
            console.log(err);
            return [];
        }
    }


    async SendNotofication(){
        var appos = await this.GetAll(false);

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "e98aac2967743e",
              pass: "268c42775bf965"
            }
          });

       appos.forEach(async app=>{

        var date = app.start.getTime();
        var hour = 1000 * 60 * 60;
        var gap = date-Date.now();

        if(gap <= hour){
          
            if(app.notified){

               await Appo.findByIdAndUpdate(app.id,{notified: true})

               transport.sendMail({
                fron: "Carlos Mota <carlos@carlos.com.br>",
                to: app.email,
                subject: "Não esqueça da sua consulta hoje !",
                text: "Qualquer duvida entre em contato!"
              }).then(()=>{
                console.log(app)
              }).catch(err =>{
                console.log(err);
              })
            }

        }


       })
    }

}
module.exports = new AppointmentService();