import { Component,Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { eCRMFirestoreService } from '../../services/ecrmfs.service';

@Component({
    selector: 'fileupload',
    templateUrl: './fileupload.component.html',
    styleUrls: ['./fileupload.component.css']
})
export class FileUploadComponent {
    @Input() fileUrl: string;
    @Input() docId: string;
    task: AngularFireUploadTask;
    percentage: Observable<number>;
    snapshot: Observable<any>;
    downloadURL: Observable<string>;
    isHovering: boolean;
    error: boolean = false;

    constructor(private _storage: AngularFireStorage, private _eCRMFSService: eCRMFirestoreService) { }

    toggleHover(event: boolean) {
        this.isHovering = event;
    }

    startUpload(event: FileList) {
        const file = event.item(0);
        if (file.type.split('/')[0] !== 'image') {
            this.error = true;
            console.log('unsupporterd file type');
            return;
        } else {
            this.error = false;
        }
        const path = this._eCRMFSService.getMemberType().company + '/' + this.fileUrl + '/' + new Date().getTime();
        //        const customMetaData = { app: 'ercm' }; //metadata is not working
        this.task = this._storage.upload(path, file);
        this.percentage = this.task.percentageChanges();
        this.snapshot = this.task.snapshotChanges().pipe(
            tap(snap => {
                if (snap.bytesTransferred === snap.totalBytes) {
                    this._eCRMFSService.setAttendance(snap.downloadURL, this.fileUrl, this.docId);
                    // Update firestore on completion
                    //this.db.collection('photos').add( { path, size: snap.totalBytes })
                }
            })
        );

        this.downloadURL = this.task.downloadURL();
        //console.log(path);
        //console.log(this.downloadURL);
    }

    isActive(snapshot) {
        return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
    }
}