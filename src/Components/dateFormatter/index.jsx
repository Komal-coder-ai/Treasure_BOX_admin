import moment from "moment";


export const dateFormatter = (data, type) => {
    let formatDate
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    moment
        .utc(data, "YYYY-MM-DD HH:mm")
        .local()
        .format("DD-MM-YYYY hh:mm a");
        // .format("ddd-MM-YYYY hh:mm a");

    if (data) {
        if (type === "onlyDate") {
            formatDate = moment
                .utc(data, "YYYY-MM-DD HH:mm")
                .local()
                .format("DD-MM-YYYY");
                // .format("ddd-MM-YYYY");
        }else{
            formatDate=  moment
            .utc(data, "YYYY-MM-DD HH:mm")
            .local()
            .format("DD-MM-YYYY hh:mm a");
            // .format("ddd-MM-YYYY hh:mm a");
        }
    }
    // if (data) {
    //     const datee = moment.tz(data, timezone); 
    //     if (type === "onlyDate") {
    //         formatDate = datee.utc(data, "YYYY-MM-DD HH:mm")
    //         .local().format('MMMM Do YYYY');
    //     } else {
    //         formatDate = datee.utc(data, "YYYY-MM-DD HH:mm")
    //         .local().format('MMMM Do YYYY, h:mm:ss a');
    //     }

    // }
    return formatDate
}