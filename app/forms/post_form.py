from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, TextAreaField
from wtforms.validators import DataRequired, Length, Optional


# Selection options for post type:
post_type_list = ["text", "quote", "image", "video", "link"]


class PostForm(FlaskForm):
    postType = SelectField("Post Type", validators=[
        DataRequired()], choices=post_type_list)
    title = StringField("Title", validators=[Length(
        max=100), Optional()])
    text = TextAreaField("Text", validators=[Length(
        max=1000), Optional()])
