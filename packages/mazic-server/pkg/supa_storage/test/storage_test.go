package test

import (
	"fmt"
	"testing"

	"github.com/golangthang/mazic-habit/pkg/supa_storage"
)

func TestBucketListAll(t *testing.T) {
	c := supa_storage.NewClient(rawUrl, token, map[string]string{})
	resp, err := c.ListBuckets()
	fmt.Println(resp, err)
}

func TestBucketFetchById(t *testing.T) {
	c := supa_storage.NewClient(rawUrl, token, map[string]string{})
	fmt.Println(c.GetBucket("test"))
}

func TestBucketCreate(t *testing.T) {
	c := supa_storage.NewClient(rawUrl, token, map[string]string{})
	fmt.Println(c.CreateBucket("test", supa_storage.BucketOptions{
		Public: true,
	}))
}

func TestBucketUpdate(t *testing.T) {
	c := supa_storage.NewClient(rawUrl, token, map[string]string{})
	_, _ = c.UpdateBucket("test", supa_storage.BucketOptions{
		Public: false,
	})

	bucket, _ := c.GetBucket("test")

	if bucket.Public {
		t.Errorf("Should have been private bucket after updating")
	}
}

func TestEmptyBucket(t *testing.T) {
	c := supa_storage.NewClient(rawUrl, token, map[string]string{})
	fmt.Println(c.EmptyBucket("test"))
}

func TestDeleteBucket(t *testing.T) {
	c := supa_storage.NewClient(rawUrl, token, map[string]string{})
	fmt.Println(c.DeleteBucket("test"))
}
