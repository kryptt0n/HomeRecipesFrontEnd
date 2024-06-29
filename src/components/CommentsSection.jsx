import { Comment, CommentAuthor, CommentGroup, 
    CommentMetadata, CommentText, CommentContent, Header, Form, FormTextArea, Button } from "semantic-ui-react";

export default function CommentSection(props) {
    return (
        <CommentGroup threaded>
        <Header as='h3' dividing>
            Comments
        </Header>
            {props.commentFields.map((comment, index) => (
                <Comment>
                    <CommentContent>
                        {comment.user && <CommentAuthor>{comment.user.username}</CommentAuthor>}
                        {!comment.user && <CommentAuthor>Anonymous</CommentAuthor>}
                        <CommentMetadata>
                            <div>{comment.postedDate}</div>
                        </CommentMetadata>
                        <CommentText>
                            <p>
                                {comment.comment}
                            </p>
                        </CommentText>
                    </CommentContent>
                </Comment>
            ))}

            <Form reply>
                <FormTextArea id="newComment"/>
                <Button content='Add Comment' type="button" labelPosition='left' icon='edit' primary onClick={props.createComment}/>
            </Form>
        </CommentGroup>
    )
}