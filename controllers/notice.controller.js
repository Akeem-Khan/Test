const Notice = require("../models/notice.model");

const getAll = (req, res) => {
    Notice.find(function (err, notices) {
        if (err) {
            res.status(500).send('Error getting Notices');
        } else {
            res.status(200).json(notices);
        }
    });
};

const getOne = (req, res) => {
    Notice.findById(req.params.id, function (err, notice) {
        if (err) {
            res.status(500).send('Error getting Notice');
        } else {
            res.status(200).json(notice);
        }
    });
};

const add = (req, res) => {
    let notice = new Notice(req.body);
    
    if(!notice.title || !notice.text || !notice.author)
        return res.status(400).send('Invalid data');
    
    notice.save()
        .then(notice => {
            res.status(201).json({ notice: 'Notice added successfully' });
        })
        .catch(err => {
            res.status(500).send('Error adding a new Notice');
        });
};

const update = (req, res) => {
    Notice.findById(req.params.id, function (err, notice) {
        if(err){
            res.status(500).send('Error updating Notice');
        } else {
            if (!req.body.title || !req.body.text || !req.body.category || !req.body.author)
                res.status(400).send('Invalid data');

            else if (!notice)
                res.status(404).send('Notice not found');

            else {
                notice.title = req.body.title;
                notice.text = req.body.text;
                notice.category = req.body.category;
                notice.author = req.body.author;
                notice.flagged.is_flagged = req.body.flagged.is_flagged;
                notice.flagged.info = req.body.flagged.info;
                notice.flagged.by = req.body.flagged.by;

                notice.save().then(notice => {
                    res.status(200).json('Notice updated');
                })
                .catch(err => {
                    res.status(500).send("Error updating Notice");
                });
            }
        }
    });
};

const deleteOne = (req, res) => {
    Notice.findByIdAndRemove(req.params.id)
        .then(data => {
            if (!data) {
                res.status(404).send('Notice not found');
            }
            else {
                res.status(200).json('Notice deleted');
            }
        })
        .catch(err => {
            res.status(500).send('Error deleting Notice')
        });
};

export { getAll, getOne, add, update, deleteOne };