import {NextResponse,NextRequest} from 'next/server';
import {connect} from '@/src/dbConfig/dbConfig';
import Post from '@/src/models/postModel';
connect();

export async function GET(request:NextRequest){
    try{
        const url=await new URL(request.url);
        const postId=url.pathname.split('/').pop();
        if(!postId){
            return NextResponse.json({error:"Post id is required",status:400});
        }
        const post=await Post.findById(postId).populate('createdBy');
        if(!post){
            return NextResponse.json({error:"Post not found",status:404});
        }
        
        return NextResponse.json(post);
    }catch(error){
        return NextResponse.json({error:error,status:500});
    }
        
}