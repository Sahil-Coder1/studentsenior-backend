const PYQ = require('../models/PYQ');
const Colleges = require('../models/Colleges');
const { Branch, Course } = require('../models/CourseBranch');

// Index - List all approved PYQs for a specific college
exports.index = async (req, res) => {
    const colleges = await Colleges.find();

    const perPage = 10;
    const page = parseInt(req.query.page) || 1;

    const { subjectName, college, year, course, semester, status, examType } =
        req.query;

    // Build a query object based on the filters provided
    const query = {};

    if (college) {
        query.college = college;
    }

    if (subjectName) {
        query.subjectName = new RegExp(subjectName, 'i');
    }

    if (year) {
        query.year = year;
    }

    if (course) {
        query.course = new RegExp(course, 'i');
    }

    if (semester) {
        query.semester = semester;
    }

    if (status) {
        query.status = status === 'true';
    }

    if (examType) {
        query.examType = new RegExp(examType, 'i');
    }

    try {
        const totalPYQs = await PYQ.countDocuments(query);
        const pyqs = await PYQ.find(query)
            .populate('college')
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage);

        res.render('pyqs/index', {
            pyqs: pyqs,
            currentPage: page,
            totalPages: Math.ceil(totalPYQs / perPage),
            filters: req.query,
            colleges,
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};

// Show form to add new PYQ
exports.new = async (req, res) => {
    try {
        const colleges = await Colleges.find();
        const courses = await Course.find();
        const branches = await Branch.find();
        return res.render('pyqs/new', {
            title: 'Add New PYQ',
            colleges,
            courses,
            branches,
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Server Error');
    }
};

// Create - Add new PYQ
exports.create = async (req, res) => {
    try {
        const {
            subjectName,
            subjectCode,
            semester,
            year,
            branch,
            course,
            examType,
            link,
            college,
            status,
        } = req.body;

        const branchArray = branch.split(',').map((b) => b.trim());

        const newPYQ = new PYQ({
            subjectName,
            subjectCode,
            semester,
            year,
            branch: branchArray,
            course,
            examType,
            link,
            college,
            status,
        });
        await newPYQ.save();

        req.flash('success', 'PYQ Created Successfully');
        return res.redirect(`/pyqs`);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const pyq = await PYQ.findById(id).populate('college');
    if (!pyq) {
        req.flash('error', 'PYQ not found!');
        return res.redirect(`/pyqs`);
    }
    res.render('pyqs/show', { pyq });
};

// Edit - Show form to edit a PYQ
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const pyq = await PYQ.findById(id).populate('college');
    const colleges = await Colleges.find();
    const courses = await Course.find();
    const branches = await Branch.find();
    if (!pyq) {
        req.flash('error', 'PYQ not found!');
        return res.redirect(`/pyqs`);
    }
    res.render('pyqs/edit', { pyq, colleges, courses, branches });
};

// edit
module.exports.editPyq = async (req, res) => {
    try {
        const { id } = req.params;
        let {
            college,
            subjectName,
            subjectCode,
            semester,
            year,
            course,
            branch,
            examType,
            link,
            status,
        } = req.body;

        // Convert the branch field from a comma-separated string to an array
        if (branch) {
            branch = branch.split(',').map((item) => item.trim());
        }

        // Create an object to update
        const updateData = {
            college,
            subjectName,
            subjectCode,
            semester,
            year,
            course,
            branch,
            examType,
            link,
            status: status === 'true',
        };

        // Update the PYQ document
        const updatedPYQ = await PYQ.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updatedPYQ) {
            req.flash('error', 'PYQ not found');
            return res.redirect('/pyqs');
        }

        req.flash('success', 'Updated Successfully');
        res.redirect(`/pyqs/${id}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error updating PYQ');
        res.redirect(`/pyqs/${id}/edit`);
    }
};

// Delete - Remove a PYQ
exports.delete = async (req, res) => {
    await PYQ.findByIdAndDelete(req.params.id);
    res.redirect(`/pyqs`);
};
