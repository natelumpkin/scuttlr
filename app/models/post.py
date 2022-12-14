from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .like import likes


class Post(db.Model):
    __tablename__ = 'posts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    post_type = db.Column(db.String(40), nullable=False)
    title = db.Column(db.String(100))
    text = db.Column(db.Text())
    created_at = db.Column(db.DateTime(), default=datetime.utcnow())
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow())

    # A post has one author, an author can have many posts
    author = db.relationship("User", back_populates="posts")
    user_likes = db.relationship(
        "User", secondary=likes, back_populates="liked_posts")

    # A post can have many comments, A comment has one post,
    comments = db.relationship("Comment", back_populates="post")

    # A post can have multiple media:
    media = db.relationship("Media", back_populates="post",
                            cascade="all, delete-orphan")

    def to_dict(self):
        """
        Converts class data into a dictionary for use in api routes
        """
        return {
            'id': self.id,
            'userId': self.user_id,
            'postType': self.post_type,
            'title': self.title,
            'text': self.text,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }
