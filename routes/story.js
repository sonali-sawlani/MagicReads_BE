const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const Chapter = require("../models/Chapter");
const passport = require("passport");

/**
 * @swagger
 * /story/{storyId}:
 *  get:
 *      tags:
 *      -  "story"
 *      description: Get the story with the story id
 *      produces:
 *      -   "application/json"
 *      parameters:
 *      - name: storyId
 *        description: ID of the story to return
 *        in: "path"
 *        type: "string"
 *        required: true
 *      responses:
 *          "200":
 *              description: A successful response
 */

router.get("/:storyId", async (req, res) => {
    const { storyId } = req.params;
    console.log(storyId);
    try {
        const stories = await Story.findOne({ _id: storyId }, (err, story) => {
            if (!story) res.status(404).send({ message: "Invalid story Id" });
            return story;
        }).lean();

        res.send({ storyData: stories, message: "Story Found" });
    } catch (err) {
        res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
         });
    }
});

// @desc Story Vote update
// @route PUT /story/:storyId/vote
// @access Private
router.put(
    "/:storyId/vote",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // res.send("increase the story vote counter");
        try {
            Story.findByIdAndUpdate(
                req.params.storyId,
                { $inc: { voteCount: 1 } },
                (err, result) => {
                    if (!result)
                        res.status(404).send({
                            message: "Story with this ID is not found",
                        });
                    console.log("Story vote counter has been increased");
                    res.send(result);
                }
            );
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);

// @desc Chapter of the Story
// @route GET /story/:storyId/chapter/:chapterId
// @access Public
router.get("/:storyId/chapter/:chapterId", (req, res) => {
    // res.send("fetch story details with that id");
    const { storyId, chapterId } = req.params;
    try {
        Chapter.findOne({ _id: chapterId, storyId }, (err, chapter) => {
            if (!chapter)
                res.status(404).send({
                    message: "Invalid Story or Chapter ID",
                });
            console.log("Chapter details have been fetched");
            res.send(chapter);
        });
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error",
            error: err.message,
        });
    }

});

// @desc Add comment on a chapter
// @route PUT /story/:storyId/chapter/:chapterId/comment
// @access Private
router.put(
    "/:storyId/chapter/:chapterId/comment",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // res.send("update the comment data in chapter model of the story");
        try {
            const { storyId, chapterId } = req.params;
            const { username, userId, comment } = req.body;
            Chapter.findOneAndUpdate(
                { _id: chapterId, storyId },
                { $push: { comments: { storyId, username, userId, comment } } },
                (err, result) => {
                    if (!result)
                        res.status(404).send({
                            message: "Invalid Story or Chapter ID",
                        });
                    console.log("Comment has been added pushed");
                    res.send(result);
                }
            );
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);


// @desc Delete comment on a chapter
// @route PUT /story/:storyId/chapter/:chapterId/comment/:commentId
// @access Private
router.delete(
    "/:storyId/chapter/:chapterId/comment/:commentId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // res.send("delete the comment data in chapter model of the story");
        try {
            const { storyId, chapterId, commentId } = req.params;
            Chapter.findOneAndDelete(
                { _id: chapterId, storyId, "comments._id": commentId },
                (err, result) => {
                    if (!result)
                        res.status(404).send({
                            message: "Invalid Story, Chapter or Comment ID",
                        });
                    console.log("Comment has been deleted");
                    res.send(result);
                }
            );
        } catch (err) {
            res.status(500).send({
                message: "Internal Server Error",
                error: err.message,
            });
        }
    }
);


module.exports = router;
