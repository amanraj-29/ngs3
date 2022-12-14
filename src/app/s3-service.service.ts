import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
@Injectable({
  providedIn: 'root'
})
export class S3ServiceService {
  private bucket: S3Client;

  constructor(private http: HttpClient) {
    this.bucket = new S3Client(
      {
     credentials: {
          accessKeyId: environment.AWS_ACCESS_KEY_ID,
          secretAccessKey: environment.AWS_SECRET_ACCESS_KEY
          //sessionToken:environment.AWS_SESSION_TOKEN
       },
        region: environment.AWS_REGION,
      }
    );
   }


async uploadFile(file: File) {

  const contentType = file.type;

  const params = {
    Bucket: 'reportunlock',
    Key: file.name,
    Body: file,
    //ACL: 'public-read',
    //ContentType: contentType
  };

  try {
    const response = await this.bucket.send(new PutObjectCommand(params));
    console.log("SUCCESS", response);
  } catch(error) {
    console.log("FAILURE", error);
  }
 
}


async uploadFileWithPreSignedURL(file: File) {
  const contentType = file.type;

  const params = {
    Bucket: 'reportunlock',
    Key: file.name,
    Body: file,
    //ACL: 'public-read',
    //ContentType: contentType
  };

  const command = new PutObjectCommand(params)

  try {
    const preSignedURL = await getSignedUrl(this.bucket, command, { expiresIn: 3600});

    console.log(preSignedURL);
    this.http.put(preSignedURL, file).subscribe({
      next: (res) => {
        console.log("SUCCESS", res);
      },
      error: (err) => {
        console.log("FAILED", err);
      },
      complete: () => {
        console.log("DONE")
      }
    })
  } catch(err) {
    console.log(err);
  }
}

}