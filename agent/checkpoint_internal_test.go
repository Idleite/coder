package agent

import (
	"testing"

	"github.com/stretchr/testify/require"
	"golang.org/x/xerrors"

	"github.com/coder/coder/v2/testutil"
)

func TestCheckpoint_CompleteWait(t *testing.T) {
	t.Parallel()
	ctx := testutil.Context(t, testutil.WaitShort)
	uut := newCheckpoint()
	err := xerrors.New("test")
	uut.complete(err)
	got := uut.wait(ctx)
	require.Equal(t, err, got)
}

func TestCheckpoint_WaitComplete(t *testing.T) {
	t.Parallel()
	ctx := testutil.Context(t, testutil.WaitShort)
	uut := newCheckpoint()
	err := xerrors.New("test")
	errCh := make(chan error, 1)
	go func() {
		errCh <- uut.wait(ctx)
	}()
	uut.complete(err)
	got := testutil.RequireRecvCtx(ctx, t, errCh)
	require.Equal(t, err, got)
}
