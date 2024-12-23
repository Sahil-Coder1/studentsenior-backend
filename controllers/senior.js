const Seniors = require('../models/Senior');
const Colleges = require('../models/Colleges');

module.exports = {
    index: async (req, res) => {
        let allSenior = await Seniors.find({}).populate('college');
        res.render('seniors/index.ejs', { allSenior });
    },
    createSeniorForm: async (req, res) => {
        const colleges = await Colleges.find({});
        res.render('seniors/new.ejs', { colleges });
    },
    createSenior: async (req, res) => {
        const {
            name,
            domain,
            branch,
            year,
            whatsapp,
            telegram,
            owner,
            college,
            status,
        } = req.body;
        const newSenior = new Seniors({
            name,
            domain,
            branch,
            whatsapp,
            telegram,
            owner,
            year,
            college,
            status,
        });
        newSenior.owner = '66d3972a467ac23a9a5fd127';
        await newSenior.save();
        req.flash('success', 'Senior Created Successfully');
        return res.redirect(`/seniors`);
    },
    showSenior: async (req, res) => {
        let { id } = req.params;
        const senior = await Seniors.findById(id)
            .populate('owner')
            .populate('college');
        if (!senior) {
            req.flash('error', 'The Senior you requested does not exist.');
            return res.redirect('/seniors');
        }

        res.render('seniors/show.ejs', { senior });
    },

    editSeniorForm: async (req, res) => {
        const colleges = await Colleges.find({});
        const { id } = req.params;
        const senior = await Seniors.findById(id);
        if (!senior) {
            req.flash('error', 'Senior not found!');
            return res.redirect(`/seniors`);
        }
        res.render('seniors/edit', { senior, colleges });
    },
    editSenior: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                name,
                domain,
                branch,
                year,
                whatsapp,
                telegram,
                college,
                status,
                profilePicture,
            } = req.body;

            // Find the senior by ID and update the details
            const updatedSenior = await Seniors.findByIdAndUpdate(
                id,
                {
                    name,
                    domain,
                    branch,
                    year,
                    whatsapp,
                    telegram,
                    college,
                    profilePicture,
                    status: status === 'true', // Convert status to boolean
                },
                {
                    new: true,
                }
            );

            if (!updatedSenior) {
                req.flash('error', 'Senior not found');
                return res.redirect('/seniors');
            }

            req.flash('success', 'Senior updated successfully');
            res.redirect(`/seniors/${id}`);
        } catch (err) {
            console.error(err);
            req.flash('error', 'Error updating senior');
            res.redirect(`/seniors/${req.params.id}/edit`);
        }
    },

    deleteSenior: async (req, res) => {
        await Seniors.findByIdAndDelete(req.params.id);
        res.redirect(`/seniors`);
    },
};
