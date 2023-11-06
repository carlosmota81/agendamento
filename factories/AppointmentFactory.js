class AppointmentFactory{

    Build(simpleApoointments){

        var day = simpleApoointments.date.getDate()+1;
        var month = simpleApoointments.date.getMonth();
        var year = simpleApoointments.date.getFullYear();
        var hour = Number.parseInt(simpleApoointments.time.split(":")[0]);
        var minutes = Number.parseInt(simpleApoointments.time.split(":")[1]);

        var startDate = new Date(year, month,day,hour,minutes,0,0)
       // startDate.getHours(startDate.getHours() -3);

        var appo = {
            id: simpleApoointments._id,
            title: simpleApoointments.name + " - " + simpleApoointments.description,
            start: startDate,
            end: startDate,
            notified: simpleApoointments.notified,
            email: simpleApoointments.email
        }
        return appo;

    }

}

module.exports = new AppointmentFactory();